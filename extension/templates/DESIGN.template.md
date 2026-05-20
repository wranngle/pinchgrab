# DESIGN.md — stub

> **This is a placeholder template, not a real DESIGN.md.** Replace
> it with your project's actual visual identity. Until you do, an
> LLM reviewing this export has nothing to ground visual feedback in
> and will guess.

## What this file is for

PinchGrab bundles `DESIGN.md` inline in every workspace export so a
downstream LLM repairing UI issues can reference your real brand —
color tokens, typography, motion, voice — instead of inventing one.

## What a real DESIGN.md typically covers

- Brand identity (tagline, positioning, aesthetic posture)
- Color tokens (primary scale, semantic, surfaces, dark mode)
- Typography (families, scale, weights)
- Spacing scale and base unit
- Border radius scale, including any signature shape
- Shadow / elevation tiers
- Motion (durations, easings, reduced-motion fallback)
- Component patterns (buttons, inputs, cards, tables, banners)
- Voice and tone rules, forbidden words
- Logo / mark usage rules
- Accessibility floor (contrast, focus, keyboard, color-only signaling)
- Anti-patterns — what looks brand-on but isn't
- Implementation snippets (CSS vars, Tailwind config)
- References (production app, Storybook, Figma)

Depth matters more than coverage — one accurate paragraph on voice
beats twelve placeholder sections.

## How to override this stub

- **In-extension:** open the PinchGrab side-panel settings and paste
  or upload your DESIGN.md. It will be bundled inline on every export.
- **On the filesystem:** drop your own DESIGN.md at `~/.agents/DESIGN.md`
  and PinchGrab will pick it up automatically.
