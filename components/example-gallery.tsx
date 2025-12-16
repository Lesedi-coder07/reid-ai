"use client";

import { useState } from "react";

interface ExampleImage {
  id: number;
  prompt: string;
  placeholder: string;
  gradient: string;
}

const examples: ExampleImage[] = [
  {
    id: 1,
    prompt: "A mystical forest at twilight with bioluminescent plants",
    placeholder: "Forest",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  },
  {
    id: 2,
    prompt: "Futuristic space station orbiting a ringed planet",
    placeholder: "Space",
    gradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
  },
  {
    id: 3,
    prompt: "Ancient temple ruins overgrown with cherry blossoms",
    placeholder: "Temple",
    gradient: "from-rose-500/20 via-pink-500/20 to-red-500/20",
  },
  {
    id: 4,
    prompt: "Steampunk airship flying through golden clouds at sunset",
    placeholder: "Airship",
    gradient: "from-amber-500/20 via-orange-500/20 to-yellow-500/20",
  },
  {
    id: 5,
    prompt: "Crystal cave with prismatic light reflections",
    placeholder: "Crystal",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
  },
  {
    id: 6,
    prompt: "Cyberpunk street market with holographic signs",
    placeholder: "Cyber",
    gradient: "from-cyan-500/20 via-blue-500/20 to-purple-500/20",
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
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${example.gradient} transition-opacity duration-300`} />
            
            {/* Animated Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div 
                className="absolute inset-0 transition-transform duration-700 ease-out"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, oklch(0.7 0.15 ${(example.id * 60) % 360}) 0%, transparent 50%)`,
                  transform: hoveredId === example.id ? "scale(1.5)" : "scale(1)",
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center">
              <div className="text-4xl md:text-5xl font-bold text-foreground/20 group-hover:text-foreground/40 transition-colors duration-300">
                {example.placeholder}
              </div>
            </div>

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

