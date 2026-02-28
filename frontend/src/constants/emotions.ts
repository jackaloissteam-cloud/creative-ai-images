export const EMOTIONS: Record<string, Record<string, string>> = {
  Joy: {
    Subtle: "gentle smile, soft happiness, quiet contentment",
    Moderate: "bright smile, cheerful expression, warm happiness",
    Intense: "beaming with joy, radiant happiness, exuberant delight",
  },
  Sadness: {
    Subtle: "pensive expression, quiet melancholy, thoughtful gaze",
    Moderate: "sorrowful eyes, visible sadness, downcast expression",
    Intense: "deep grief, tearful expression, overwhelming sorrow",
  },
  Anger: {
    Subtle: "slight frown, mild irritation, tense expression",
    Moderate: "stern expression, clear frustration, furrowed brow",
    Intense: "fierce expression, intense anger, powerful rage",
  },
  Fear: {
    Subtle: "cautious expression, slight unease, wary eyes",
    Moderate: "anxious expression, visible worry, fearful gaze",
    Intense: "terrified expression, overwhelming fear, panic-stricken",
  },
};

export function buildEmotionPrompt(emotion: string, intensity: string): string {
  return EMOTIONS[emotion]?.[intensity] ?? "";
}
