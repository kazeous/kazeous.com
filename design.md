# Design — Kazeous

A locked design system for the v2 app. Every page uses the same flat, technical-editorial language established by the production interface.

## Genre

Editorial, with technical UI discipline.

## Macrostructure family

- Marketing/home: Split Studio — asymmetric copy/image hero followed by an art/project split and route index.
- App/index pages: Long Document — strong page title, restrained controls, ruled content grid.
- Detail pages: Gallery focus — image-led canvas with compact metadata bands.

## Theme

- `--color-paper`: `oklch(97% 0.012 232)`
- `--color-paper-2`: `oklch(93% 0.018 232)`
- `--color-paper-3`: `oklch(89% 0.026 232)`
- `--color-ink`: `oklch(22% 0.025 248)`
- `--color-ink-2`: `oklch(46% 0.028 244)`
- `--color-rule`: `oklch(83% 0.025 230)`
- `--color-accent`: `oklch(60% 0.15 242)`
- `--color-focus`: `oklch(66% 0.18 267)`

## Typography

- Display: Monomaniac One, 400, roman.
- Body: Inter Variable, 400–750.
- Outlier: Potra, wordmark only.
- Display tracking: `-0.035em`.
- Type scale anchor: `--text-display: clamp(3.25rem, 7.5vw, 5.5rem)`.

## Spacing

Use the named 4-point scale in `tokens.css`. Page CSS must consume tokens rather than raw spacing values.

## Motion

- Fade-only page entrance; no repeated scroll reveals.
- State changes use `--ease-out`, `--ease-in`, or `--ease-in-out`.
- Reduced motion collapses to the `--dur-instant` duration.

## Microinteractions stance

- Silent success; no celebratory toasts.
- Focus appears instantly with a visible outline.
- Hover uses one signal: usually a flat colour change.

## CTA voice

- Primary: ink fill, square edge, short verb-led label.
- Secondary: hairline outline, square edge, short verb-led label.

## Per-page allowances

- Home and Lore may use user-owned artwork.
- Projects is information-dense and does not add decorative imagery.
- Gallery lets artwork carry the surface; controls stay quiet.
- Content pages use typography and rules only.

## What pages must share

- Kaze wordmark, inset dark glass navigation, centered desktop links, and a compact mobile menu.
- Cool paper palette, cyan-blue accent, and the three-face type system.
- Square controls, hairline rules, no decorative shadows or gradients.
- Ft2 inline footer and the same focus treatment.

## What pages may differ on

- Column ratio and content density.
- Image crop and presence of enrichment.
- Page-specific control groups required by existing logic.

## Exports

### tokens.css

```css
:root {
  --color-paper: oklch(97% 0.012 232);
  --color-paper-2: oklch(93% 0.018 232);
  --color-paper-3: oklch(89% 0.026 232);
  --color-ink: oklch(22% 0.025 248);
  --color-ink-2: oklch(46% 0.028 244);
  --color-rule: oklch(83% 0.025 230);
  --color-accent: oklch(60% 0.15 242);
  --color-accent-ink: oklch(98% 0.008 232);
  --color-focus: oklch(66% 0.18 267);

  --font-display: "Monomaniac One", sans-serif;
  --font-body: "Inter Variable", sans-serif;
  --font-wordmark: "Potra", sans-serif;

  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.25rem;
  --text-lg: 1.5625rem;
  --text-xl: 1.953rem;
  --text-2xl: 2.441rem;
  --text-3xl: 3.052rem;
  --text-display: clamp(3.25rem, 7.5vw, 5.5rem);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-instant: 80ms;
  --dur-short: 180ms;
  --dur-medium: 360ms;
  --rule-hair: 1px;
  --radius-flat: 0;
  --radius-control: 2px;
}
```

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(97% 0.012 232);
  --color-paper-2: oklch(93% 0.018 232);
  --color-paper-3: oklch(89% 0.026 232);
  --color-ink: oklch(22% 0.025 248);
  --color-ink-2: oklch(46% 0.028 244);
  --color-rule: oklch(83% 0.025 230);
  --color-accent: oklch(60% 0.15 242);
  --color-accent-ink: oklch(98% 0.008 232);
  --color-focus: oklch(66% 0.18 267);
  --font-display: "Monomaniac One", sans-serif;
  --font-body: "Inter Variable", sans-serif;
  --font-wordmark: "Potra", sans-serif;
  --spacing-3xs: 0.25rem;
  --spacing-2xs: 0.5rem;
  --spacing-xs: 0.75rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-md: 1.25rem;
  --text-xl: 1.953rem;
  --text-2xl: 2.441rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --radius-card: 0;
  --radius-pill: 0;
  --radius-input: 2px;
}
```

### DTCG `tokens.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": {"$value": "oklch(97% 0.012 232)", "$type": "color"},
    "paper-2": {"$value": "oklch(93% 0.018 232)", "$type": "color"},
    "paper-3": {"$value": "oklch(89% 0.026 232)", "$type": "color"},
    "ink": {"$value": "oklch(22% 0.025 248)", "$type": "color"},
    "ink-2": {"$value": "oklch(46% 0.028 244)", "$type": "color"},
    "rule": {"$value": "oklch(83% 0.025 230)", "$type": "color"},
    "accent": {"$value": "oklch(60% 0.15 242)", "$type": "color"},
    "accent-ink": {"$value": "oklch(98% 0.008 232)", "$type": "color"},
    "focus": {"$value": "oklch(66% 0.18 267)", "$type": "color"}
  },
  "font": {
    "display": {"$value": "Monomaniac One, sans-serif", "$type": "fontFamily"},
    "body": {"$value": "Inter Variable, sans-serif", "$type": "fontFamily"},
    "wordmark": {"$value": "Potra, sans-serif", "$type": "fontFamily"}
  },
  "space": {
    "xs": {"$value": "0.75rem", "$type": "dimension"},
    "sm": {"$value": "1rem", "$type": "dimension"},
    "md": {"$value": "1.5rem", "$type": "dimension"},
    "lg": {"$value": "2rem", "$type": "dimension"},
    "xl": {"$value": "3rem", "$type": "dimension"}
  },
  "duration": {
    "instant": {"$value": "80ms", "$type": "duration"},
    "short": {"$value": "180ms", "$type": "duration"},
    "medium": {"$value": "360ms", "$type": "duration"}
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 97% 0.012 232;
  --foreground: 22% 0.025 248;
  --card: 93% 0.018 232;
  --card-foreground: 22% 0.025 248;
  --popover: 93% 0.018 232;
  --popover-foreground: 22% 0.025 248;
  --primary: 60% 0.15 242;
  --primary-foreground: 98% 0.008 232;
  --secondary: 89% 0.026 232;
  --secondary-foreground: 22% 0.025 248;
  --muted: 83% 0.025 230;
  --muted-foreground: 46% 0.028 244;
  --accent: 60% 0.15 242;
  --accent-foreground: 98% 0.008 232;
  --border: 83% 0.025 230;
  --input: 83% 0.025 230;
  --ring: 66% 0.18 267;
  --radius: 0;
}
```
