# Specification

## Summary
**Goal:** Reduce the application bundle size for successful deployment, fix two CSS/layout bugs in the settings panel and navigation dropdown, and implement a prompt-only fallback mode if image generation cannot be included within budget.

**Planned changes:**
- Audit and remove unused imports and non-essential dependencies to reduce bundle size without removing any user-visible features.
- Add a prompt-only fallback mode: if image generation via Hugging Face is unavailable or exceeds budget, display the fully assembled prompt text and all selected parameters on screen instead of generating an image.
- Fix the settings panel CSS layout bug where controls render rotated 90 degrees and overlap each other — all rows (Art Style, Aspect Ratio, Model, Diversity, Clothing Style, Camera, Lighting, Composition, Emotion, etc.) must render in a normal horizontal stacked vertical layout.
- Fix the navigation dropdown z-index/overlap bug so that open dropdown lists render above sibling nav elements and bottom items do not crowd adjacent menu headings.

**User-visible outcome:** The app deploys successfully, all settings controls and UI panels display correctly without rotation or overlap, navigation dropdowns open cleanly above sibling elements, and if image generation is skipped the user sees the constructed prompt and all parameter values clearly instead of a blank or error state. Prompt history continues to record all submissions.
