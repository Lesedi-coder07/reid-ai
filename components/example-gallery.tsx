"use client";

import { useState } from "react";
import Image from "next/image";

interface ExampleImage {
  id: number;
  prompt: string;
  image: string;
}

const examples: ExampleImage[] = [
  {
    id: 1,
    prompt: "Nelson Mandela in a taylor swift tee",
    image: "/examples/7.jpeg",
  },
  {
    id: 2,
    prompt: "Pretoria in the future",
    image: "/examples/8.jpeg",
  },
  {
    id: 3,
    prompt: "A beautiful hyper realistic traditional church (Europe style)",
    image: "/examples/3.jpeg",
  },
  {
    id: 4,
    prompt: "Steampunk airship flying through golden clouds at sunset",
    image: "/examples/4.jpeg",
  },
  {
    id: 5,
    prompt: "A lamborghini car in a hyper realistic style",
    image: "/examples/5.jpeg",
  },
  {
    id: 6,
    prompt: "Elon musk at shoprite",
    image: "/examples/6.jpeg",
  },
];

export function ExampleGallery({ onSelectPrompt }: { onSelectPrompt?: (prompt: string) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {examples.map((example, index) => (
          <button
            key={example.id}
            onClick={() => onSelectPrompt?.(example.prompt)}
            onMouseEnter={() => setHoveredId(example.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              group relative aspect-square rounded-xl overflow-hidden 
              border border-border/30 hover:border-primary/50 
              transition-all duration-500 ease-out
              animate-in fade-in slide-in-from-bottom-4
              hover:scale-[1.02] hover:shadow-xl
              stagger-${index + 1}
            `}
            style={{ animationFillMode: "backwards" }}
          >
            {/* Image */}
            <Image
              src={example.image}
              alt={example.prompt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />

            {/* Hover Overlay with Prompt */}
            <div className={`
              absolute inset-0 z-20 bg-background/90 backdrop-blur-sm
              flex items-center justify-center p-4
              transition-opacity duration-300
              ${hoveredId === example.id ? "opacity-100" : "opacity-0"}
            `}>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {example.prompt}
              </p>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

