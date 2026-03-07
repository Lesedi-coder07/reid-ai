import { google } from "@ai-sdk/google";
import { generateText } from "ai";

type GenerateHistoryEntry = {
  role: "user" | "assistant";
  prompt: string;
  note?: string;
};

type GenerateContextImage = {
  imageBase64: string;
  mimeType?: string;
  kind?: "generated" | "reference";
};

const MAX_HISTORY_ENTRIES = 8;

function isGenerateHistoryEntry(value: unknown): value is GenerateHistoryEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.prompt === "string" &&
    (candidate.note === undefined || typeof candidate.note === "string")
  );
}

function isGenerateContextImage(value: unknown): value is GenerateContextImage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.imageBase64 === "string" &&
    candidate.imageBase64.length > 0 &&
    (candidate.mimeType === undefined || typeof candidate.mimeType === "string") &&
    (candidate.kind === undefined ||
      candidate.kind === "generated" ||
      candidate.kind === "reference")
  );
}

function buildIterationPrompt(
  prompt: string,
  history: GenerateHistoryEntry[],
  contextImages: GenerateContextImage[]
) {
  const transcript = history
    .slice(-MAX_HISTORY_ENTRIES)
    .map((entry, index) => {
      const speaker = entry.role === "user" ? "User" : "Assistant";
      const note = entry.note ? ` | Note: ${entry.note}` : "";

      return `${index + 1}. ${speaker}: ${entry.prompt}${note}`;
    })
    .join("\n");

  const hasGeneratedContext = contextImages.some(
    (image) => image.kind === "generated"
  );
  const hasReferenceContext = contextImages.some(
    (image) => image.kind === "reference"
  );

  const sections = [
    "Create exactly one polished image in response to the latest request.",
    contextImages.length > 0
      ? hasGeneratedContext && hasReferenceContext
        ? "Use the supplied context images together. Generated thread images are the evolving artwork state, and uploaded reference images are supplemental guidance. Treat the newest generated image as the current state to edit."
        : hasGeneratedContext
          ? "Use the supplied generated thread images as the evolving artwork state. Treat the newest generated image as the current state to edit."
          : "Use the supplied uploaded reference images as visual guidance for the latest request."
      : "Start a fresh image generation from the user's latest request.",
    contextImages.length > 1
      ? "Generated thread images are provided first in chronological order, followed by uploaded reference images."
      : undefined,
    history.length > 0
      ? `Conversation so far:\n${transcript}`
      : undefined,
    `Latest request: ${prompt}`,
  ];

  return sections.filter(Boolean).join("\n\n");
}

export async function POST(req: Request) {
  try {
    const {
      prompt,
      contextImages,
      image,
      imageMimeType,
      history,
    }: {
      prompt?: unknown;
      contextImages?: unknown;
      image?: unknown;
      imageMimeType?: unknown;
      history?: unknown;
    } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Build the request based on whether an image is attached
    const generateOptions = {
      model: google("gemini-3-pro-image-preview"),
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
    };

    const sanitizedHistory = Array.isArray(history)
      ? history.filter(isGenerateHistoryEntry).slice(-MAX_HISTORY_ENTRIES)
      : [];

    const sanitizedContextImages = Array.isArray(contextImages)
      ? contextImages.filter(isGenerateContextImage)
      : [];

    if (
      sanitizedContextImages.length === 0 &&
      typeof image === "string" &&
      image.length > 0
    ) {
      sanitizedContextImages.push({
        imageBase64: image,
        mimeType: typeof imageMimeType === "string" ? imageMimeType : undefined,
        kind: "reference",
      });
    }

    const iterationPrompt = buildIterationPrompt(
      prompt,
      sanitizedHistory,
      sanitizedContextImages
    );

    let result;

    if (sanitizedContextImages.length > 0) {
      // Use messages format when one or more context images are attached
      result = await generateText({
        ...generateOptions,
        system:
          "You are an iterative image generation assistant. Preserve established subjects, composition, and intent unless the latest request explicitly changes them.",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: iterationPrompt },
              ...sanitizedContextImages.map((contextImage) => ({
                type: "image" as const,
                image: contextImage.imageBase64,
                ...(typeof contextImage.mimeType === "string"
                  ? { mediaType: contextImage.mimeType }
                  : {}),
              })),
            ],
          },
        ],
      });
    } else {
      // Use simple prompt format when no image
      result = await generateText({
        ...generateOptions,
        system:
          "You are an image generation assistant. Generate exactly one polished image for the user's latest request.",
        prompt: iterationPrompt,
      });
    }

    // Find the generated image in the response files
    const imageFile = result.files?.find((file) =>
      file.mediaType.startsWith("image/")
    );

    if (!imageFile) {
      return Response.json(
        { error: "No image was generated" },
        { status: 500 }
      );
    }

    return Response.json({
      image: imageFile.base64,
      mimeType: imageFile.mediaType,
      text:
        result.text.trim() ||
        (sanitizedContextImages.length > 0
          ? "Rendered the next variation from your latest request."
          : "Generated a fresh image from your prompt."),
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
