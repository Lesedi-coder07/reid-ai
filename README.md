# Reid AI

A next-generation AI image generator backed by **Sulta Tech**, an AI engineering company.

Transform your ideas into stunning, high-resolution images with a beautiful, modern interface.

## Features

- **Lightning Fast Generation** – Optimized inference for rapid image creation
- **Stunning Quality** – Up to 4K resolution, finely detailed images
- **Modern UI** – Elegant dark theme with smooth gradients and animations
- **Plug-and-Play** – Simple setup; just add your API key and get started

## Tech Stack

- **Next.js 16** – React framework with App Router
- **AI SDK 5** – Vercel's AI SDK for seamless AI integration
- **Google Imagen 3** – State-of-the-art image generation model
- **Tailwind CSS 4** – Utility-first CSS for flexible styling
- **Base UI** – Accessible, composable React UI primitives

## Getting Started

### Prerequisites

- Node.js 18+
- A Google AI API key (get one at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/reid-ai.git
cd reid-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a descriptive prompt in the text area  
2. Click **Generate Image** to create your artwork  
3. Download the generated image or create a new one

### Prompt Tips

- Be descriptive and specific about what you want
- Include style references (for example, “cinematic lighting”, “watercolor style”)
- Mention details like colors, mood, and composition
- Try the example prompts for inspiration

## Project Structure

```
reid-ai/
  app/
    api/
      generate/
        route.ts           # Image generation API endpoint
    globals.css            # Global styles and theme
    layout.tsx             # Root layout with fonts
    page.tsx               # Main landing page
  components/
    image-generator.tsx    # Image generation interface
    example-gallery.tsx    # Example prompts gallery
    ui/                    # UI components (Button, Input, etc.)
  lib/
    utils.ts               # Utility functions
```

## Environment Variables

| Variable                         | Description                           |
|-----------------------------------|---------------------------------------|
| `GOOGLE_GENERATIVE_AI_API_KEY`    | Your Google AI API key for Imagen 3   |

## License

MIT

---

Built by [Sulta Tech](https://sulta.tech) — AI Engineering Company
