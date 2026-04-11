/**
 * LUMEN Marketing Site — Theme catalog
 *
 * Maps the 7 showcase themes from the brief to their internal .name keys
 * in themeMap. Used by the theme switcher across Landing, Themes, and Components pages.
 */

export interface ShowcaseTheme {
  /** Internal theme name (matches ProductTheme.name / themeMap key) */
  id: string
  /** Display label for the switcher UI */
  label: string
  /** One-line descriptor */
  tagline: string
  /** Swatches for preview tiles — pulled from theme brand/surface */
  swatchTokens: string[]
}

export const SHOWCASE_THEMES: ShowcaseTheme[] = [
  {
    id: 'lumen',
    label: 'Lumen',
    tagline: 'Confident, modern, editorial',
    swatchTokens: ['brand.default', 'accent.default', 'surface.light', 'surface.lightDarker'],
  },
  {
    id: 'lumen-dark',
    label: 'Lumen Dark',
    tagline: 'Dense, focused, nocturnal',
    swatchTokens: ['brand.default', 'accent.default', 'surface.light', 'surface.lightDarker'],
  },
  {
    id: 'fall',
    label: 'Fall',
    tagline: 'Warm, grounded, organic',
    swatchTokens: ['brand.default', 'accent.default', 'surface.light', 'surface.lightDarker'],
  },
  {
    id: 'foliage',
    label: 'Foliage',
    tagline: 'Clean, clinical, utilitarian',
    swatchTokens: ['brand.default', 'accent.default', 'surface.light', 'surface.lightDarker'],
  },
  {
    id: 'spring',
    label: 'Spring',
    tagline: 'Classic, serifed, scholarly',
    swatchTokens: ['brand.default', 'accent.default', 'surface.light', 'surface.lightDarker'],
  },
  {
    id: 'pampas',
    label: 'Pampas',
    tagline: 'Soft, literary, human',
    swatchTokens: ['brand.default', 'accent.default', 'surface.light', 'surface.lightDarker'],
  },
  {
    id: 'rainy-night',
    label: 'Rainy Night',
    tagline: 'Moody, dusk, contemplative',
    swatchTokens: ['brand.default', 'accent.default', 'surface.light', 'surface.lightDarker'],
  },
]
