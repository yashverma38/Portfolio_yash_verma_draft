# Portfolio Visual Design System — Yash Verma

This is the design bible for yash-v.in. Every visual decision, CSS change, component addition, or layout modification must follow these rules. This document is the "skill" that ensures design consistency and quality across all future development.

---

## 1. Design Tokens (The Source of Truth)

All values live as CSS custom properties in `:root` in `styles.css`. Never hardcode colors, fonts, or shadows — always reference tokens.

### Color Palette — "Ocean & Sunrise"

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#faf7f2` | Page background (warm off-white) |
| `--bg-surface` | `#ffffff` | Card/panel surfaces |
| `--bg-warm` | `#f3ede4` | Warm section backgrounds |
| `--ocean` | `#2d6a8a` | Primary blue. Links, accents, interactive states |
| `--ocean-deep` | `#1a3f54` | Headings (h1, h2), logo, dark emphasis |
| `--ocean-soft` | `rgba(45,106,138,0.07)` | Light blue tint for backgrounds, tags |
| `--sunrise` | `#d97756` | CTA buttons, active nav indicator, logo dot |
| `--sunrise-soft` | `rgba(217,119,86,0.08)` | Button hover tints |
| `--sunrise-glow` | `rgba(217,119,86,0.2)` | Button hover box-shadow |
| `--sage` | `#5a8f6b` | Success/result metrics, badges |
| `--sage-soft` | `rgba(90,143,107,0.08)` | Result badge backgrounds |
| `--sand` | `#b8923a` | Analytics tags, WIP badges |
| `--plum` | `#8b6f8a` | Design tags |
| `--text` | `#1a2e3b` | Primary body text |
| `--text-secondary` | `#4d6475` | Paragraphs, descriptions |
| `--text-tertiary` | `#8a9aa6` | Labels, metadata, fine print |

**Rules:**
- Never introduce new colors without adding them as tokens first
- The warm `--bg` (#faf7f2) is the default. White sections use `--bg-surface`
- Alternating section backgrounds follow this pattern: warm → white → warm → ocean-deep (for emphasis)
- All text colors must pass WCAG AA contrast on their background (4.5:1 ratio minimum)

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-heading` | `'Source Serif 4', Georgia, serif` | h1-h4, metric numbers, logo |
| `--font-body` | `'DM Sans', system-ui, sans-serif` | Body text, buttons, labels, nav |

**Hierarchy rules:**
- Hero titles: `clamp(2.5rem, 5vw, 3.5rem)`, weight 600, `--ocean-deep`
- Section titles: `clamp(1.6rem, 3vw, 2.25rem)`, weight 600, `--ocean-deep`
- Card titles: `1.35rem`, weight 600 (inherits `--text`)
- Body text: `1rem`, weight 400, `--text-secondary`, `line-height: 1.7-1.85`
- Labels/metadata: `0.75-0.82rem`, weight 600, `--text-tertiary`, uppercase + letter-spacing
- Tags: `0.72rem`, weight 600, colored backgrounds from the token set

**Type rules:**
- Never use more than these 2 font families
- Body line-height is 1.7 (general) or 1.85 (case study long-form)
- Max reading width: 720px for long-form content (`.cs-content`)
- Use `clamp()` for responsive font sizes on headings
- Bold (`<strong>`) in body copy: use strategically on metrics, credentials, differentiators. Max 1-3 per paragraph

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--section-pad` | `5.5rem` (desktop), `3.5rem` (mobile) | Section top/bottom padding |
| `--container` | `min(1060px, 90vw)` | Content max-width |

**Spacing rules:**
- Card internal padding: `2-2.5rem`
- Grid gaps: `1-1.5rem` (tight), `2-4rem` (loose sections)
- Component internal gaps: `0.75rem` (flex/grid gap)
- Between sections: always use `--section-pad`, never custom values
- Whitespace ratio: aim for 35-40% negative space in any section

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 4px rgba(26,46,59,0.06)` | Cards at rest |
| `--shadow-md` | `0 4px 20px rgba(26,46,59,0.08)` | Cards on hover, dropdowns |
| `--shadow-lg` | `0 12px 40px rgba(26,46,59,0.1)` | Mobile nav, hero images |

### Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | All transitions (ease-out feel) |
| `--duration` | `0.3s` | Standard hover/transition duration |

**Animation rules:**
- All hover transitions: `0.3s` with `--ease`
- Scroll reveal: `0.6s` with `--ease`, `translateY(20px)` start
- Card hover: `translateY(-2px)` lift + shadow upgrade to `--shadow-md`
- Link arrows (→): animate `gap` from `0.3rem` to `0.55rem` on hover
- Button hover: `translateY(-1px)` + glow shadow
- Image hover: `scale(1.03-1.05)` within container
- All animations respect `prefers-reduced-motion`

### Border Radius Scale

| Usage | Radius |
|-------|--------|
| Tags, badges, small chips | `4-5px` |
| Buttons, inputs | `8px` |
| Cards, callouts | `10-12px` |
| CTA boxes, hero photos | `16px` |
| App screenshots, phone frames | `20-24px` |
| Profile photos | `50%` (circle) |
| Nav dropdown (mobile) | `10px` |

---

## 2. Component Patterns

### Cards
All cards follow this pattern:
```css
background: var(--bg-surface);
border: 1px solid var(--border);           /* or box-shadow: var(--shadow-sm) */
border-radius: 12px;
padding: 1.75rem - 2.25rem;
transition: all var(--duration) var(--ease);
```

Hover state:
```css
transform: translateY(-2px);
box-shadow: var(--shadow-md);              /* or border-color: var(--border-hover) */
```

**Card variants:**
- `.work-card` — flex column, shadow-sm base, shadow-md hover
- `.side-project` — flex column, shadow-sm base, shadow-md hover
- `.pillar` — border base, border-hover + shadow-md hover
- `.personality-card` — border base, centered content
- `.cs-metric` — border base, centered, no hover
- `.dash-stat-card` — border base, centered, subtle hover
- `.rec-item` — bg change on hover, no shadow

### Buttons
| Class | Background | Text | Border | Usage |
|-------|-----------|------|--------|-------|
| `.btn--primary` | `--sunrise` | white | sunrise | Main CTAs |
| `.btn--outline` | transparent | `--text` | `--border-hover` | Secondary actions |
| `.btn--ghost` | transparent | `--text-secondary` | none | Tertiary/inline links |
| `.btn--ocean` | white | `--ocean-deep` | white | CTAs on dark backgrounds |
| `.btn--sm` | (modifier) | | | Smaller padding + font |

### Tags
Semantic color coding:
- Strategy → ocean (blue)
- Growth → sage (green)
- Design → plum (purple)
- Analytics → sand (gold)

### Section Backgrounds
Alternate backgrounds to create rhythm:
1. `(default)` — `--bg` (warm off-white)
2. `.section--alt` — `--bg-surface` (white)
3. `.section--warm` — `--bg-warm` (warm beige)
4. `.section--ocean` — `--ocean-deep` (dark blue, white text)

Pattern on homepage: hero (default) → work (white) → analytics CTA (ocean-deep) → about (warm) → CTA (default)

### Navigation
- Sticky header with blur backdrop: `backdrop-filter: blur(16px)`
- Logo: serif font, `--ocean-deep`, dot in `--sunrise`
- Links: `--text-secondary`, `--text` on hover/active
- Active indicator: 2px `--sunrise` underline
- CTA button: `--sunrise` outlined
- Mobile: hamburger → dropdown card with `--shadow-lg`

---

## 3. Layout Rules

### Grid System
- Container: `min(1060px, 90vw)` centered
- Homepage work split: `grid-template-columns: 1fr 1fr` (equal columns)
- Work page cards: full-width, `1fr 1fr` internal grid (content + visual)
- Case study content: `max-width: 720px` centered
- Stats grids: `repeat(6, 1fr)` → `repeat(3, 1fr)` at 1024px → `repeat(2, 1fr)` at 480px
- Chart grids: `repeat(2, 1fr)` → `1fr` at 768px

### Responsive Breakpoints
| Breakpoint | Changes |
|-----------|---------|
| `1024px` | Pillar grid → 1col, work-split → 1col, full-width cards → stack |
| `768px` | Mobile nav, hero stacks, contact stacks, section-pad shrinks to 3.5rem |
| `480px` | Hero title 2rem, actions stack, photo shrinks |

### Image Treatment
- Profile photos: circular, 3-4px `--bg-warm` border, `--shadow-sm`/`--shadow-md`
- App screenshots: `border-radius: 20px`, dark background container, gradient label overlay, hover lift (-6px + shadow)
- Phone frames: `border-radius: 24px`, `box-shadow: 0 12px 40px rgba(0,0,0,0.2)`
- Group photos: `border-radius: 16px`, `--shadow-md`, `object-fit: cover`
- Always include `width`/`height` attributes for CLS prevention
- Use `loading="lazy"` for below-fold images, `loading="eager"` for hero

---

## 4. Writing & Content Rules

### Voice
- First person, conversational, confident but not arrogant
- Short sentences. Punch, don't ramble.
- Lead with the result, explain the process after
- Specific numbers over vague claims ("+18% retention" not "improved retention")

### Formatting
- **Bold** (`<strong>`) for: metrics, company names, key results, credentials. Max 1-3 per paragraph.
- No em dashes. Use commas for asides, colons for lists/labels, periods for contrast, parentheses for tangentials, semicolons for related clauses.
- En dashes only for date ranges (Jan 2025 – Present)
- Arrow entities: `&rarr;` for "read more" links, `&larr;` for "back" links

### Case Study Structure
1. **Hero**: back link, tags, title, TL;DR paragraph
2. **Meta bar**: Company, Role, Timeline, Impact (4-column grid)
3. **Content** (720px max-width):
   - "The context" — set the scene
   - Callout box for key realization
   - "The problem" — specific challenges as bullet list
   - "What I did" — numbered phases with h3s
   - "Results" — 3-column metric cards
   - "What I learned" — bordered box with bold-lead bullet points
4. **Navigation**: previous/next case study links

---

## 5. File Organization

| File | Purpose |
|------|---------|
| `styles.css` | All global + page-specific styles (single file, organized by comment headers) |
| `analytics.css` | Dashboard-specific styles (dash- prefixed classes) |
| `scripts.js` | Menu toggle, scroll reveal, localStorage tracking, Mixpanel events |
| `analytics-dashboard.js` | Mixpanel data fetching + Chart.js rendering |
| `auth.js` | Firebase Auth + Razorpay payment + access gating |

**CSS naming:** BEM-inspired. Block: `work-card`, Element: `work-card__title`, Modifier: `work-card--full`. Dashboard classes prefixed with `dash-`.

**Never:**
- Create new CSS files for page-specific styles (add to `styles.css` under a comment header)
- Use inline styles
- Use `!important`
- Use IDs for styling (IDs are for JS hooks only)

---

## 6. Performance Rules

- Fonts: preconnect to `fonts.googleapis.com` + `fonts.gstatic.com`
- Images: always specify dimensions, use lazy loading, WebP when possible
- CSS: single file (styles.css), no unused selectors
- JS: scripts at end of body, `async` for third-party
- No framework dependencies (vanilla CSS + JS only, Chart.js is the only library)

---

## 7. Deployment

- **Hosting**: Vercel (`npx vercel --prod --yes`)
- **Domain**: yash-v.in
- **Git**: push to main, deploy separately via Vercel CLI
- **Firebase**: Cloud Functions for payment backend
- **Analytics**: Mixpanel (client-side, auto-capture + custom events)

---

## 8. Visual Quality Checklist

Before any visual change ships, verify:

- [ ] Uses design tokens (no hardcoded colors, fonts, or shadows)
- [ ] Follows the border-radius scale
- [ ] Card interactions include hover lift + shadow
- [ ] Text hierarchy follows the type scale
- [ ] Sufficient whitespace (35-40% negative space)
- [ ] Responsive at 1024px, 768px, and 480px
- [ ] Images have width/height attributes and lazy loading
- [ ] No em dashes in body copy
- [ ] Bold text is strategic (metrics, results, credentials)
- [ ] Animations use --ease and --duration tokens
- [ ] Alternating section backgrounds create visual rhythm
- [ ] WCAG AA contrast ratios on all text
- [ ] Mobile nav works (hamburger menu)
- [ ] Scroll reveal (.reveal) on new sections/cards
