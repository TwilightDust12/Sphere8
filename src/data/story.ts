import type { SequenceManifest } from "../lib/story"
import manifest from "../../public/story/manifest.json"

// Activate only after the generated footage and all frame paths are verified.
export const sequence: SequenceManifest | null = manifest
// User chose portrait stills after the video request was rejected for insufficient credits.
export const mobileSequence: SequenceManifest | null = null
export const chapters = [
  {
    label: "The possibility",
    title: "Every home begins with a possibility.",
    text: "Architecture, engineering and construction. Thoughtfully connected, from the first sketch to the final detail.",
  },
  {
    label: "The structure",
    title: "Designed with purpose. Engineered with care.",
    text: "A clear vision. A considered plan. The expertise to bring every element together.",
  },
  {
    label: "The details",
    title: "The details make it yours.",
    text: "Material, light and space come together to turn a building into a place to belong.",
  },
  {
    label: "The feeling",
    title: "Built for what comes next.",
    text: "A place for your everyday. And everything you imagine beyond it.",
  },
] as const
