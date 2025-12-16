import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt, image } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Build the request based on whether an image is attached
    const generateOptions = {
      model: google("gemini-2.0-flash-exp"),
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
    };

    let result;

    if (image && typeof image === "string") {
      // Use messages format when an image is attached
      result = await generateText({
        ...generateOptions,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Generate an image based on this reference and description: ${prompt}` },
              { type: "image", image: image },
            ],
          },
        ],
      });
    } else {
      // Use simple prompt format when no image
      result = await generateText({
        ...generateOptions,
        prompt: `Generate an image: ${prompt}`,
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
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
