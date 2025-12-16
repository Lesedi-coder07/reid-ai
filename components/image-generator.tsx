"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconSparkles, IconLoader2, IconDownload, IconRefresh } from "@tabler/icons-react";

interface ImageGeneratorProps {
  initialPrompt?: string;
}

export function ImageGenerator({ initialPrompt = "" }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(`data:${data.mimeType};base64,${data.image}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `pixelflow-${Date.now()}.png`;
    link.click();
  };

  const reset = () => {
    setImage(null);
    setPrompt("");
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 md:p-8 glow-subtle">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent/30 rounded-br-2xl pointer-events-none" />

        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Describe your vision
            </label>
            <Textarea
              placeholder="A cyberpunk cityscape at sunset with neon lights reflecting off wet streets, flying cars in the distance, ultra detailed, cinematic lighting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none bg-background/50 border-border/50 focus:border-primary/50 text-base"
              disabled={isLoading}
            />
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={generateImage}
              disabled={isLoading || !prompt.trim()}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="size-5 animate-spin mr-2" />
                  Creating magic...
                </>
              ) : (
                <>
                  <IconSparkles className="size-5 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
            {image && (
              <Button
                onClick={reset}
                variant="outline"
                className="h-12 px-4"
              >
                <IconRefresh className="size-5" />
              </Button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Generated Image */}
          {image && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-border/50 glow">
                <img
                  src={image}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                onClick={downloadImage}
                variant="outline"
                className="w-full h-11"
              >
                <IconDownload className="size-5 mr-2" />
                Download Image
              </Button>
            </div>
          )}

          {/* Placeholder when no image */}
          {!image && !isLoading && (
            <div className="aspect-square rounded-xl border border-dashed border-border/50 bg-muted/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <IconSparkles className="size-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your generated image will appear here. Enter a prompt above and click generate to create something amazing.
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="aspect-square rounded-xl border border-border/50 bg-muted/20 flex items-center justify-center animate-pulse">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center glow">
                  <IconLoader2 className="size-10 text-primary animate-spin" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Generating your masterpiece...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

