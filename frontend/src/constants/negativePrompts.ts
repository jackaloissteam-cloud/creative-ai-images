export type NegativePromptPreset =
  | "quality"
  | "anatomy"
  | "style"
  | "nsfw"
  | "minimal";

export interface NegativePromptOption {
  value: NegativePromptPreset;
  label: string;
  prompt: string;
}

export const NEGATIVE_PROMPT_PRESET_OPTIONS: NegativePromptOption[] = [
  {
    value: "quality",
    label: "Quality (Recommended)",
    prompt:
      "blurry, low quality, pixelated, jpeg artifacts, noise, grainy, overexposed, underexposed, bad lighting",
  },
  {
    value: "anatomy",
    label: "Anatomy Fix",
    prompt:
      "deformed, distorted, disfigured, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, mutated hands, poorly drawn hands, malformed hands",
  },
  {
    value: "style",
    label: "Style Clean",
    prompt:
      "cartoon, anime, illustration, painting, drawing, sketch, unrealistic, CGI, 3D render",
  },
  {
    value: "nsfw",
    label: "Safe for Work",
    prompt:
      "nsfw, nude, explicit, sexual, violence, gore, disturbing content",
  },
  {
    value: "minimal",
    label: "Minimal",
    prompt: "blurry, low quality, watermark, text, logo",
  },
];
