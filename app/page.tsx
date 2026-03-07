import Image from "next/image";
import Link from "next/link";
import {
  IconArrowRight,
  IconBrandGithub,
  IconDownload,
  IconPaperclip,
  IconRefresh,
} from "@tabler/icons-react";
import { ExampleGallery } from "@/components/example-gallery";

const featureCards = [
  {
    eyebrow: "Chat-native",
    title: "Iterate on images the same way you iterate on copy.",
    body: "Keep the same thread alive while you push composition, lighting, styling, and polish without re-explaining the whole brief.",
  },
  {
    eyebrow: "Reference-aware",
    title: "Start from a prompt or seed the conversation with an image.",
    body: "Drop in a reference, generate the first pass, then keep revising from the latest output so the thread stays coherent.",
  },
  {
    eyebrow: "Built to ship",
    title: "Move from concept frames to campaign-ready visuals.",
    body: "Use one space for exploration, art direction, quick variants, and final image selection before handing assets downstream.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090b0f] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(53,95,181,0.18),transparent_26%),radial-gradient(circle_at_left,rgba(249,115,22,0.08),transparent_22%),linear-gradient(90deg,rgba(255,255,255,0.02)_0%,transparent_14%,transparent_86%,rgba(255,255,255,0.02)_100%)]" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/6 bg-[#090b0f]/70 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <span className="text-sm font-medium text-white">R</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                  Reid AI
                </p>
                <p className="hidden text-sm text-white/70 sm:block">
                  Conversational image generation
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <IconBrandGithub className="size-5" />
              </a>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90 sm:px-4"
              >
                <span className="sm:hidden">Studio</span>
                <span className="hidden sm:inline">Open Studio</span>
                <IconArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section className="px-4 pb-18 pt-16 sm:px-6 lg:px-8 lg:pt-24">
            <div className="mx-auto max-w-7xl space-y-14 lg:space-y-18">
              <div className="space-y-8 lg:mx-auto lg:max-w-5xl lg:text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/72 lg:mx-auto">
                  <Image
                    src="/sulta-logo.png"
                    alt="Sulta Tech"
                    width={18}
                    height={18}
                    className="rounded"
                  />
                  Backed by Sulta Tech
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:mx-auto lg:max-w-4xl lg:text-7xl">
                    Generate, refine, and ship images in one conversation.
                  </h1>
                  <p className="max-w-xl text-lg leading-8 text-white/58 lg:mx-auto lg:max-w-2xl">
                    Reid AI turns image generation into a real workflow: threaded
                    prompts, reference-aware iterations, and a studio built for
                    moving from rough ideas to polished visuals.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 lg:justify-center">
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
                  >
                    Launch the studio
                    <IconArrowRight className="size-4" />
                  </Link>
                  <a
                    href="#examples"
                    className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-sm text-white/72 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    View examples
                  </a>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[1480px]">
                <div className="absolute -inset-8 rounded-[40px] bg-[radial-gradient(circle_at_top,rgba(86,135,237,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.14),transparent_38%)] blur-3xl" />
                <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#111318] p-3 shadow-[0_50px_160px_rgba(0,0,0,0.48)] sm:p-4 lg:hidden">
                  <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0b0d12]">
                    <Image
                      src="/hero/scrr.png"
                      alt="Reid AI studio product interface"
                      width={3338}
                      height={2000}
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                </div>

                <div className="relative hidden overflow-hidden rounded-[34px] border border-white/10 bg-[#111318] p-4 shadow-[0_50px_160px_rgba(0,0,0,0.48)] lg:block">
                  <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0b0d12]">
                    <div className="grid min-h-[760px] grid-cols-[72px_minmax(0,1fr)]">
                      <div className="flex flex-col items-center justify-between border-r border-white/8 bg-[#14161b]/92 py-4">
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium text-white">
                            R
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-2xl text-white/75">
                            +
                          </div>
                          <div className="mt-4 flex flex-col items-center gap-5 text-sm text-white/42">
                            <span>?</span>
                            <span>@</span>
                            <span>[]</span>
                            <span>&lt;/&gt;</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                          <span className="text-sm text-white/40">v</span>
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d8d4ca] text-sm font-medium text-black">
                            D
                          </div>
                        </div>
                      </div>

                      <div className="relative flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4">
                          <div className="inline-flex items-center gap-2 text-lg text-white/82">
                            <span className="truncate">
                              Design a bold streetwear campaign poster
                            </span>
                            <span className="text-white/40">⌄</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/62 transition-colors hover:bg-white/[0.05] hover:text-white"
                            >
                              <IconRefresh className="size-4" />
                              Reset
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/82 transition-colors hover:bg-white/[0.05]"
                            >
                              Share
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 px-8 pb-44 pt-8">
                          <div className="mx-auto max-w-[760px] space-y-7">
                            <div className="flex justify-end">
                              <div className="max-w-[270px] rounded-[22px] bg-black/78 px-5 py-4 text-lg text-white shadow-[0_18px_42px_rgba(0,0,0,0.36)]">
                                Design a bold streetwear campaign poster with a single
                                model and clean editorial framing
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h2 className="font-serif text-[3.2rem] leading-[1.12] text-white/92">
                                Generated a fresh image from your prompt.
                              </h2>

                              <div className="flex items-center gap-2 text-white/35">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10">
                                  <IconPaperclip className="size-4" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10">
                                  <IconDownload className="size-4" />
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10">
                                  <IconRefresh className="size-4" />
                                </div>
                              </div>

                              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#17181c] shadow-[0_34px_90px_rgba(0,0,0,0.36)]">
                                <Image
                                  src="/examples/4.jpeg"
                                  alt="Streetwear editorial example"
                                  width={1400}
                                  height={1020}
                                  className="w-full object-cover"
                                />
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {[
                                  "Make it more cinematic.",
                                  "Keep the composition and change only the lighting.",
                                  "Push the realism further.",
                                  "Try a cleaner premium ad look.",
                                ].map((chip) => (
                                  <div
                                    key={chip}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/55"
                                  >
                                    {chip}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute inset-x-6 bottom-5">
                          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-6 py-5 shadow-[0_34px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
                            <div className="min-h-[92px] text-3xl text-white/28">
                              Reply...
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 text-white/52">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-2xl">
                                  +
                                </div>
                                <p className="text-base">
                                  Follow-ups use prior results and any attachments.
                                </p>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-base text-white/62">Reid Image</div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                                  <IconArrowRight className="size-4 rotate-[-90deg]" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 text-center text-sm text-white/32">
                            Reid AI can make mistakes. Double-check important image
                            prompts and outputs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/34">
                  Why Reid
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  A studio workflow instead of a one-off image box.
                </h2>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {featureCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-white/34">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-4 text-2xl font-medium leading-tight text-white">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="examples" className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/34">
                    Examples
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Image directions made inside Reid AI.
                  </h2>
                </div>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 text-sm text-white/72 transition-colors hover:text-white"
                >
                  Try the studio
                  <IconArrowRight className="size-4" />
                </Link>
              </div>

              <ExampleGallery />
            </div>
          </section>

          <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-white/[0.04] px-6 py-12 sm:px-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/34">
                    Ready to create
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Move from rough prompt to final visual direction in one thread.
                  </h2>
                  <p className="mt-4 text-base leading-8 text-white/58">
                    Launch the studio, start a prompt, and keep art-directing the
                    image until it looks right.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
                  >
                    Open studio
                    <IconArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white/42 sm:flex-row sm:items-center sm:justify-between">
            <p>Reid AI by Sulta Tech.</p>
            <p>Threaded image generation for concepts, campaigns, and final assets.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
