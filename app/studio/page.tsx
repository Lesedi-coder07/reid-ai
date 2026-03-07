import type { Metadata } from "next";
import { IterativeImageStudio } from "@/components/iterative-image-studio";

export const metadata: Metadata = {
  title: "Reid AI Studio | Iterative Image Generation",
  description:
    "A dedicated Reid AI studio for iterative image generation, prompt revisions, and conversation-style visual tweaking.",
};

export default function StudioPage() {
  return <IterativeImageStudio />;
}
