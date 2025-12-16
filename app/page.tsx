"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  IconArrowRight,
  IconBrandGithub,
  IconPaperclip,
  IconMessage,
  IconLoader2,
  IconDownload,
  IconX,
} from "@tabler/icons-react";
import { ExampleGallery } from "@/components/example-gallery";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          image: attachedImage || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(`data:${data.mimeType};base64,${data.image}`);
      setImageMimeType(data.mimeType);
      // Clear attached image after successful generation
      removeAttachedImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const extension = imageMimeType?.split("/")[1] || "png";
    const link = document.createElement("a");
    link.href = image;
    link.download = `ai-image-${Date.now()}.${extension}`;
    link.click();
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const clearResult = () => {
    setImage(null);
    setImageMimeType(null);
    setError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 data (remove the data:image/...;base64, prefix)
      const base64 = result.split(",")[1];
      setAttachedImage(base64);
      setAttachedImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    setAttachedImagePreview(null);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-[#0a0a0a]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[min(900px,200vw)] h-[min(900px,200vw)] rounded-full opacity-80"
          style={{
            background: "radial-gradient(ellipse at center, rgba(251, 146, 60, 0.5) 0%, rgba(236, 72, 153, 0.4) 30%, rgba(59, 130, 246, 0.3) 60%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Secondary glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[min(600px,150vw)] h-[min(400px,100vw)] rounded-full opacity-60"
          style={{
            background: "radial-gradient(ellipse at center, rgba(251, 146, 60, 0.6) 0%, rgba(249, 115, 22, 0.4) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
               
                <span className="text-xl font-bold tracking-tight text-white">Reid AI</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <IconBrandGithub className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <img src="/sulta-logo.png" alt="Sulta Tech" className="size-4 sm:size-5 rounded flex-shrink-0" />
              <span className="text-white/80">Backed by <a href="https://sultatech.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white cursor-pointer transition-colors">Sulta Tech</a></span>
              <IconArrowRight className="size-3.5 sm:size-4 text-white/60 flex-shrink-0" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="text-white">Create something</span>
              <br />
              <span className="bg-linear-to-r from-orange-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">Beautiful</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed px-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Transform your ideas into realistic images by describing what you want
            </p>

            {/* Chat Input Box */}
            <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative rounded-2xl bg-[#1a1a1a] border border-white/10 p-3 sm:p-4 shadow-2xl">
                <Textarea
                  ref={inputRef}
                  placeholder="Describe the image you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[60px] sm:min-h-[80px] max-h-[200px] resize-none bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base p-0"
                  disabled={isLoading}
                />
                
                {/* Attached Image Preview */}
                {attachedImagePreview && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                    <div className="relative group">
                      <img
                        src={attachedImagePreview}
                        alt="Attached"
                        className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        onClick={removeAttachedImage}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IconX className="size-3" />
                      </button>
                    </div>
                    <span className="text-white/50 text-xs">Reference image attached</span>
                  </div>
                )}

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                    <label className={`inline-flex items-center h-8 px-2 sm:px-3 text-xs sm:text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors flex-shrink-0 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <IconPaperclip className="size-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">{attachedImage ? "Change" : "Attach"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                   
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 sm:px-3 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                      disabled
                    >
                      <IconMessage className="size-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Chat</span>
                    </Button>
                    <Button
                      onClick={generateImage}
                      disabled={isLoading || !prompt.trim()}
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
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
            </div>

            {/* Error Display */}
            {error && (
              <div className="max-w-2xl mx-auto p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in duration-300">
                {error}
              </div>
            )}

            {/* Generated Image Result */}
            {image && (
              <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a]">
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                      onClick={downloadImage}
                      size="sm"
                      className="h-8 px-3 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                    >
                      <IconDownload className="size-4 mr-1.5" />
                      Download
                    </Button>
                    <Button
                      onClick={clearResult}
                      size="sm"
                      className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                    >
                      <IconX className="size-4" />
                    </Button>
                  </div>
                  <img
                    src={image}
                    alt="Generated image"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-300">
                <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/30 to-pink-500/30 flex items-center justify-center">
                      <IconLoader2 className="size-8 text-orange-400 animate-spin" />
                    </div>
                    <p className="text-white/60 text-sm">
                      Creating your image...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Examples Section */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Pictures Made with Reid AI
              </h2>
              <p className="text-white/50 text-xs sm:text-sm">
                See what other people made with Reid. Click to use the prompt.
              </p>
            </div>

            <ExampleGallery onSelectPrompt={handleExampleClick} />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
              <div className="flex items-center gap-2">
                
                <span className="font-semibold text-white">Reid AI</span>
              </div>
              <p className="text-xs sm:text-sm text-white/40 text-center">
                Built by Sulta Tech. Open source and free to use.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <IconBrandGithub className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
