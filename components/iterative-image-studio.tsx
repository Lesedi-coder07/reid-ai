"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  IconArrowRight,
  IconChevronDown,
  IconDownload,
  IconLoader2,
  IconMenu2,
  IconPaperclip,
  IconPlus,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";

type StudioMessage = {
  id: string;
  role: "user" | "assistant";
  prompt: string;
  note?: string;
  image?: string;
  imageBase64?: string;
  mimeType?: string;
  createdAt: string;
};

type AssistantImageMessage = StudioMessage & {
  role: "assistant";
  image: string;
  imageBase64: string;
  mimeType: string;
};

type ReferenceImage = {
  base64: string;
  preview: string;
  mimeType: string;
  name: string;
};

type ContextImagePayload = {
  imageBase64: string;
  mimeType: string;
  kind: "generated" | "reference";
};

type ChatThread = {
  id: string;
  title: string;
  messages: StudioMessage[];
  referenceImages: ReferenceImage[];
  updatedAt: string;
};

const STARTER_PROMPTS = [
  "Make a premium product photo of a transparent espresso cup on a brushed steel counter, cinematic lighting",
  "Design a bold streetwear campaign poster with a single model and clean editorial framing",
  "Create a hyper-real futuristic sneaker ad with soft reflections and a minimal studio set",
];

const QUICK_TWEAKS = [
  "Make it more cinematic.",
  "Keep the composition and change only the lighting.",
  "Push the realism further.",
  "Try a cleaner premium ad look.",
];

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyThread(): ChatThread {
  return {
    id: createId(),
    title: "New chat",
    messages: [],
    referenceImages: [],
    updatedAt: new Date().toISOString(),
  };
}

function createThreadTitle(prompt: string) {
  const normalized = prompt.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return "New chat";
  }

  return normalized.length > 42 ? `${normalized.slice(0, 42)}...` : normalized;
}

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

function sortThreads(threads: ChatThread[]) {
  return [...threads].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );
}

function isAssistantImageMessage(
  message: StudioMessage
): message is AssistantImageMessage {
  return (
    message.role === "assistant" &&
    typeof message.image === "string" &&
    typeof message.imageBase64 === "string" &&
    typeof message.mimeType === "string"
  );
}

function getContextImagePayloads(
  generatedImages: AssistantImageMessage[],
  referenceImages: ReferenceImage[]
): ContextImagePayload[] {
  return [
    ...generatedImages.map((image) => ({
      imageBase64: image.imageBase64,
      mimeType: image.mimeType,
      kind: "generated" as const,
    })),
    ...referenceImages.map((image) => ({
      imageBase64: image.base64,
      mimeType: image.mimeType,
      kind: "reference" as const,
    })),
  ];
}

function readReferenceImage(file: File) {
  return new Promise<ReferenceImage>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Failed to read that image."));
        return;
      }

      const [, base64] = result.split(",");

      if (!base64) {
        reject(new Error("Failed to process that image."));
        return;
      }

      resolve({
        base64,
        preview: result,
        mimeType: file.type,
        name: file.name,
      });
    };

    reader.onerror = () => {
      reject(new Error("Failed to read that image."));
    };

    reader.readAsDataURL(file);
  });
}

export function IterativeImageStudio() {
  const initialThread = createEmptyThread();
  const [threads, setThreads] = useState<ChatThread[]>([initialThread]);
  const [activeThreadId, setActiveThreadId] = useState(initialThread.id);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThreadPickerOpen, setIsThreadPickerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread =
    threads.find((thread) => thread.id === activeThreadId) ?? threads[0];
  const messages = activeThread?.messages ?? [];
  const referenceImages = activeThread?.referenceImages ?? [];
  const generatedImages = messages.filter(isAssistantImageMessage);
  const latestGeneratedImage = generatedImages[generatedImages.length - 1] ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeThreadId, isLoading, messages.length]);

  const focusComposer = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const updateActiveThread = (updater: (thread: ChatThread) => ChatThread) => {
    setThreads((current) =>
      sortThreads(
        current.map((thread) =>
          thread.id === activeThreadId ? updater(thread) : thread
        )
      )
    );
  };

  const createNewThread = () => {
    if (isLoading) {
      return;
    }

    const nextThread = createEmptyThread();
    setThreads((current) => [nextThread, ...current]);
    setActiveThreadId(nextThread.id);
    setIsThreadPickerOpen(false);
    setIsMobileSidebarOpen(false);
    setPrompt("");
    setError(null);
    focusComposer();
  };

  const resetActiveThread = () => {
    if (!activeThread || isLoading) {
      return;
    }

    updateActiveThread((thread) => ({
      ...thread,
      title: "New chat",
      messages: [],
      referenceImages: [],
      updatedAt: new Date().toISOString(),
    }));
    setPrompt("");
    setError(null);
    focusComposer();
  };

  const queuePrompt = (nextPrompt: string) => {
    setPrompt(nextPrompt);
    setError(null);
    setIsThreadPickerOpen(false);
    setIsMobileSidebarOpen(false);
    focusComposer();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0 || !activeThread) {
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setError("Please select an image file.");
      return;
    }

    try {
      const nextReferenceImages = await Promise.all(
        files.map((file) => readReferenceImage(file))
      );

      updateActiveThread((thread) => ({
        ...thread,
        referenceImages: [...thread.referenceImages, ...nextReferenceImages],
        updatedAt: new Date().toISOString(),
      }));
      setError(null);
    } catch (readError) {
      setError(
        readError instanceof Error
          ? readError.message
          : "Failed to process that image."
      );
    }
  };

  const removeReferenceImage = (indexToRemove: number) => {
    if (!activeThread) {
      return;
    }

    updateActiveThread((thread) => ({
      ...thread,
      referenceImages: thread.referenceImages.filter(
        (_, index) => index !== indexToRemove
      ),
      updatedAt: new Date().toISOString(),
    }));
    setError(null);
  };

  const downloadImage = (message: AssistantImageMessage) => {
    const extension = message.mimeType.split("/")[1] || "png";
    const link = document.createElement("a");
    link.href = message.image;
    link.download = `reid-studio-${Date.now()}.${extension}`;
    link.click();
  };

  const submitPrompt = async (overridePrompt?: string) => {
    if (!activeThread) {
      return;
    }

    const nextPromptValue = (overridePrompt ?? prompt).trim();

    if (!nextPromptValue || isLoading) {
      return;
    }

    const contextImages = getContextImagePayloads(
      generatedImages,
      referenceImages
    );
    const userMessage: StudioMessage = {
      id: createId(),
      role: "user",
      prompt: nextPromptValue,
      createdAt: new Date().toISOString(),
    };
    const priorHistory = messages.slice(-8).map((message) => ({
      role: message.role,
      prompt: message.prompt,
      note: message.note,
    }));

    updateActiveThread((thread) => ({
      ...thread,
      title:
        thread.messages.length === 0 ? createThreadTitle(nextPromptValue) : thread.title,
      messages: [...thread.messages, userMessage],
      updatedAt: userMessage.createdAt,
    }));
    setPrompt("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: nextPromptValue,
          contextImages,
          history: priorHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image.");
      }

      const assistantMessage: StudioMessage = {
        id: createId(),
        role: "assistant",
        prompt: nextPromptValue,
        note:
          typeof data.text === "string" && data.text.trim()
            ? data.text.trim()
            : contextImages.length > 0
              ? "Updated the image using your latest instruction."
              : "Generated a fresh image from your prompt.",
        image: `data:${data.mimeType};base64,${data.image}`,
        imageBase64: data.image,
        mimeType: data.mimeType,
        createdAt: new Date().toISOString(),
      };

      updateActiveThread((thread) => ({
        ...thread,
        messages: [...thread.messages, assistantMessage],
        updatedAt: assistantMessage.createdAt,
      }));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating the image."
      );
    } finally {
      setIsLoading(false);
      focusComposer();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitPrompt();
    }
  };

  return (
    <div className="min-h-screen bg-[#101114] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_38%),linear-gradient(90deg,rgba(255,255,255,0.02)_0%,transparent_18%,transparent_82%,rgba(255,255,255,0.02)_100%)]" />

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close navigation menu"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col justify-between border-r border-white/10 bg-[#151618]/95 px-4 py-5 shadow-[0_32px_90px_rgba(0,0,0,0.55)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.08]"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  R
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                  aria-label="Close menu"
                >
                  <IconX className="size-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={createNewThread}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                disabled={isLoading}
              >
                <IconPlus className="size-4" />
                New chat
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white/85"
              >
                <IconDownload className="size-4.5" />
                <span>Downloads</span>
              </button>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9d5cd] text-sm font-medium text-black">
                  D
                </div>
                <div>
                  <p className="text-sm text-white">Design account</p>
                  <p className="text-xs text-white/40">Studio profile</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col items-center justify-between border-r border-white/8 bg-[#151618]/95 py-4 backdrop-blur-xl md:flex">
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.08]"
          >
            R
          </Link>

          <button
            type="button"
            onClick={createNewThread}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
            disabled={isLoading}
            aria-label="New chat"
          >
            <IconPlus className="size-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/80"
          >
            <IconDownload className="size-4.5" />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d9d5cd] text-sm font-medium text-black">
            D
          </div>
        </div>
      </aside>

      <div className="relative z-10 md:pl-[72px]">
        <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/8 bg-[#101114]/88 px-4 py-4 backdrop-blur-xl sm:px-6 md:left-[72px]">
          <div className="flex items-center justify-between">
            <div className="relative flex min-w-0 flex-1 items-center justify-center md:justify-start">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="absolute left-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white md:hidden"
                aria-label="Open navigation menu"
              >
                <IconMenu2 className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsThreadPickerOpen((current) => !current)}
                className="inline-flex min-w-0 max-w-[calc(100vw-7rem)] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-center text-base text-white/80 transition-colors hover:bg-white/[0.05] hover:text-white sm:max-w-[240px] sm:text-lg md:max-w-none md:justify-start md:text-left"
              >
                <span className="max-w-[180px] truncate sm:max-w-[240px]">
                  {activeThread?.title || "Greeting"}
                </span>
                <IconChevronDown className="size-4 text-white/45" />
              </button>

              {isThreadPickerOpen ? (
                <div className="absolute left-0 top-full mt-3 w-[min(320px,calc(100vw-2rem))] rounded-[28px] border border-white/10 bg-[#1a1b1f]/95 p-3 shadow-[0_32px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                  <div className="mb-3 flex items-center justify-between px-2">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                      Threads
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white/65 transition-colors hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-50"
                      onClick={createNewThread}
                      disabled={isLoading}
                      aria-label="Create new thread"
                    >
                      <IconPlus className="size-4" />
                      New
                    </button>
                  </div>

                  <div className="max-h-[360px] space-y-2 overflow-y-auto">
                    {threads.map((thread) => {
                      const isActive = thread.id === activeThreadId;
                      const lastMessage = thread.messages[thread.messages.length - 1];

                      return (
                        <button
                          key={thread.id}
                          type="button"
                          onClick={() => {
                            if (isLoading) {
                              return;
                            }

                            setActiveThreadId(thread.id);
                            setPrompt("");
                            setError(null);
                            setIsThreadPickerOpen(false);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`block w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                            isActive
                              ? "border-white/14 bg-white/[0.09]"
                              : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.05]"
                          }`}
                          disabled={isLoading}
                        >
                          <p className="truncate text-sm font-medium text-white">
                            {thread.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-white/40">
                            {lastMessage?.prompt || "Start a new image conversation"} ·{" "}
                            {formatTime(thread.updatedAt)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <Button
                variant="ghost"
                className="text-white/60 hover:bg-white/[0.05] hover:text-white"
                onClick={resetActiveThread}
                disabled={
                  isLoading ||
                  !activeThread ||
                  (activeThread.messages.length === 0 &&
                    activeThread.referenceImages.length === 0)
                }
              >
                <IconRefresh className="size-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                className="border-white/10 bg-transparent text-white/80 hover:bg-white/[0.05] hover:text-white"
              >
                Share
              </Button>
            </div>
          </div>
        </header>

        <main className="relative min-h-screen pt-[76px] sm:pt-[80px]">
          <div className="h-[calc(100vh-76px)] overflow-y-auto px-4 pb-[270px] pt-4 sm:h-[calc(100vh-80px)] sm:px-6 sm:pb-[230px]">
            <div className="mx-auto w-full max-w-[920px]">
              {messages.length === 0 ? (
                <div className="flex min-h-[60vh] flex-col justify-center gap-8 pb-16 pt-[10vh]">
                  <div className="max-w-xl">
                    <h2 className="font-serif text-4xl leading-tight text-white/92">
                      Hi! What should I help create today?
                    </h2>
                    <div className="mt-5 flex items-center gap-2 text-white/35">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/[0.05]"
                      >
                        <IconPaperclip className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/[0.05]"
                      >
                        <IconDownload className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/[0.05]"
                      >
                        <IconRefresh className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-3">
                    {STARTER_PROMPTS.map((starterPrompt) => (
                      <button
                        key={starterPrompt}
                        type="button"
                        onClick={() => queuePrompt(starterPrompt)}
                        className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-[13px] leading-5 text-white/68 transition-colors hover:bg-white/[0.06] hover:text-white sm:rounded-[26px] sm:px-5 sm:py-5 sm:text-sm sm:leading-6"
                      >
                        {starterPrompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-14 pb-10 pt-8">
                  {messages.map((message) => {
                    if (message.role === "user") {
                      return (
                        <div key={message.id} className="flex justify-end">
                          <div className="max-w-[280px] rounded-[22px] bg-black/65 px-5 py-4 text-lg text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                            {message.prompt}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={message.id} className="max-w-[760px] space-y-4">
                        {message.note ? (
                          <p className="font-serif text-[2rem] leading-[1.35] text-white/90">
                            {message.note}
                          </p>
                        ) : null}

                        <div className="flex items-center gap-2 text-white/35">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/[0.05]"
                          >
                            <IconPaperclip className="size-4" />
                          </button>
                          {isAssistantImageMessage(message) ? (
                            <button
                              type="button"
                              onClick={() => downloadImage(message)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/[0.05]"
                            >
                              <IconDownload className="size-4" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/[0.05]"
                          >
                            <IconRefresh className="size-4" />
                          </button>
                        </div>

                        {isAssistantImageMessage(message) ? (
                          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#17181c] shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
                            <img
                              src={message.image}
                              alt={message.prompt}
                              className="w-full object-cover"
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full">
                        <IconLoader2 className="size-8 animate-spin text-orange-300" />
                      </div>
                      <p className="font-serif text-[2rem] leading-[1.35] text-white/90">
                        Making the next image now.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="pointer-events-none fixed bottom-3 left-0 right-0 z-20 flex justify-center px-3 md:bottom-5 md:left-[72px] md:px-4">
            <div className="pointer-events-auto w-full max-w-[920px]">
              {referenceImages.length > 0 ? (
                <div className="mb-3 rounded-[24px] border border-white/10 bg-[#17181c]/90 px-4 py-3 backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">
                        {referenceImages.length} attached reference
                        {referenceImages.length === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs text-white/40">
                        Follow-ups use these with the thread&apos;s generated images.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {referenceImages.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2"
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate text-sm text-white">
                            {image.name}
                          </p>
                          <p className="text-xs text-white/40">Reference image</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeReferenceImage(index)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors hover:text-white"
                          aria-label={`Remove reference image ${image.name}`}
                        >
                          <IconX className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {generatedImages.length > 0 ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  {QUICK_TWEAKS.map((tweakPrompt) => (
                    <button
                      key={tweakPrompt}
                      type="button"
                      onClick={() => queuePrompt(tweakPrompt)}
                      className="rounded-full border border-white/10 bg-[#17181c]/75 px-2.5 py-1 text-[11px] text-white/55 backdrop-blur-xl transition-colors hover:bg-white/[0.08] hover:text-white sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      {tweakPrompt}
                    </button>
                  ))}
                </div>
              ) : null}

              {error ? (
                <div className="mb-3 rounded-[24px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-xl">
                  {error}
                </div>
              ) : null}

              <div className="rounded-[22px] border border-white/10 bg-[#111111] px-3 py-2.5 shadow-[0_32px_90px_rgba(0,0,0,0.4)] sm:rounded-[30px] sm:px-6 sm:py-4">
                <Textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Reply..."
                  disabled={isLoading}
                  className="min-h-[32px] resize-none border-0 bg-[#111111] p-0 text-sm leading-5 text-white placeholder:text-white/32 focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[72px] sm:text-base sm:leading-6"
                />

                <div className="mt-2.5 flex items-center justify-between gap-2.5 sm:mt-4 sm:flex-wrap sm:gap-4">
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <label className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white sm:h-10 sm:w-10">
                      <IconPlus className="size-4.5 sm:size-5" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>

                    <p className="hidden text-sm text-white/55 sm:block">
                      {latestGeneratedImage || referenceImages.length > 0
                        ? "Follow-ups use prior generated images and any attachments."
                        : "Attach one or more images or start with a prompt."}
                    </p>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:w-auto sm:flex-none sm:justify-start sm:gap-4">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-[13px] text-white/60 sm:gap-2 sm:text-sm"
                    >
                      Reid Image
                      <IconChevronDown className="size-4" />
                    </button>

                    <Button
                      onClick={() => void submitPrompt()}
                      disabled={isLoading || !prompt.trim()}
                      className="h-9 w-9 rounded-full bg-white p-0 text-black hover:bg-white/90 sm:h-11 sm:w-11"
                    >
                      {isLoading ? (
                        <IconLoader2 className="size-4 animate-spin" />
                      ) : (
                        <IconArrowRight className="size-4 rotate-[-90deg]" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-center text-xs text-white/34 sm:mt-3 sm:text-sm">
                Reid AI can make mistakes. Double-check important image prompts and outputs.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
