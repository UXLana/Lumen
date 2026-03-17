// =============================================================================
// RID Landing Page Prototype — Mock Data (Massachusetts)
// =============================================================================

export interface LabResult {
  testType: string
  result: 'passed' | 'failed' | 'pending'
  value?: string
  unit?: string
}

export interface StateConfig {
  name: string
  abbreviation: string
  agencyName: string
  agencyUrl: string
  legalMessage: string
  warningMessages: string[]
  links: { label: string; url: string; icon?: 'alert' | 'phone' | 'link' | 'info' }[]
  campaign?: {
    headline: string
    body: string
    linkLabel: string
    linkUrl: string
  }
  badges: { label: string; icon: 'equity' | 'local' | 'veteran' | 'sustainability' }[]
}

export interface ProductData {
  name: string
  brand: string
  brandTagline: string
  category: string
  strain: string
  strainType: 'Indica' | 'Sativa' | 'Hybrid'
  packageTag: string
  batchId: string
  weight: string
  servingSize: string
  servingsPerPackage: number
  thcPerServing: string
  thcPerPackage: string
  thcPercent: string
  cbdPercent: string
  terpenes: string
  harvestDate: string
  packageDate: string
  expirationDate: string
  description: string
  labName: string
  labLicense: string
  testDate: string
  testStatus: 'passed' | 'failed' | 'pending'
  coaUrl: string
  labResults: LabResult[]
  retailer: {
    name: string
    license: string
    location: string
    purchaseDate: string
  }
}

// ---------------------------------------------------------------------------
// Massachusetts State Configuration
// ---------------------------------------------------------------------------

export const massachusettsConfig: StateConfig = {
  name: 'Massachusetts',
  abbreviation: 'MA',
  agencyName: 'Cannabis Control Commission',
  agencyUrl: 'https://masscannabiscontrol.com',
  legalMessage:
    'This product is licensed and regulated by the Massachusetts Cannabis Control Commission. It has been tested for safety and compliance in accordance with state law.',
  warningMessages: [
    'For use only by adults 21 and older.',
    'Keep out of reach of children.',
    'This product may cause intoxication and impair your ability to drive or operate machinery.',
  ],
  links: [
    {
      label: 'Report Adverse Event',
      url: 'https://masscannabiscontrol.com/adverse-events',
      icon: 'alert',
    },
    {
      label: 'Poison Control Center',
      url: 'tel:1-800-222-1222',
      icon: 'phone',
    },
    {
      label: 'MA Cannabis Commission',
      url: 'https://masscannabiscontrol.com',
      icon: 'link',
    },
    {
      label: 'Consumer Education',
      url: 'https://masscannabiscontrol.com/know-the-laws',
      icon: 'info',
    },
  ],
  campaign: {
    headline: 'Know What You\'re Buying',
    body: 'The Massachusetts Cannabis Control Commission is committed to ensuring consumer safety in the regulated cannabis market.',
    linkLabel: 'Learn more at MassCannabisControl.com',
    linkUrl: 'https://masscannabiscontrol.com/know-the-laws',
  },
  badges: [
    { label: 'Social Equity Participant', icon: 'equity' },
    { label: 'Locally Grown', icon: 'local' },
  ],
}

// ---------------------------------------------------------------------------
// Brand Data — for "About Brand" tab in v2
// ---------------------------------------------------------------------------

export interface BrandData {
  name: string
  tagline: string
  logo?: string
  heroImages: string[]
  description: string
  extendedDescription?: string
  website: string
  purchaseUrl: string
  faqs: { question: string; answer: string }[]
}

export const sampleBrand: BrandData = {
  name: 'Commonwealth Edibles Co.',
  tagline: 'Real-Fruit Cannabis Infused Gummies',
  heroImages: [],
  description:
    'Commonwealth Edibles Co. is a craft cannabis brand based in Northampton, Massachusetts, specializing in small-batch, real-fruit edibles. Every product is made with locally sourced ingredients and full-spectrum cannabis extracts.',
  extendedDescription:
    'Our gummies use cannabis extracts blended with unique botanical and fruit terpenes to craft world class flavors, effects, and experiences. Our products are designed and continuously improved by a team of food scientists who work daily to create our industry leading cannabis edibles. Our stringent manufacturing standards and quality controls ensure consistent dosing and flavor throughout every batch of product we produce.',
  website: 'https://commonwealthedibles.com',
  purchaseUrl: 'https://commonwealthedibles.com/dispensaries',
  faqs: [
    {
      question: 'What effects do they have?',
      answer:
        'Our gummies contain THC, the psychoactive component of cannabis which is responsible for creating the "high" experienced when consuming cannabis products. Effects vary by strain and individual tolerance. Start low, go slow.',
    },
    {
      question: 'Where should I start?',
      answer:
        'We recommend starting with a single 5mg or 10mg serving and waiting at least 2 hours before consuming more. Our Blueberry Bliss Gummies (Hybrid) are a great starting point for new consumers.',
    },
    {
      question: 'Can I purchase your products online?',
      answer:
        'Due to Massachusetts state regulations, cannabis products cannot be sold online. You can find our products at licensed dispensaries across the state. Visit our website for a store locator.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Sample Product — Edible (to show serving info prominently)
// ---------------------------------------------------------------------------

export const sampleProduct: ProductData = {
  name: 'Blueberry Bliss Gummies',
  brand: 'Commonwealth Edibles Co.',
  brandTagline: 'Craft cannabis edibles made in small batches in Northampton, MA.',
  category: 'Edible',
  strain: 'Blue Dream',
  strainType: 'Hybrid',
  packageTag: '1A4060300000022000018742',
  batchId: 'BATCH-2026-0287',
  weight: '100mg (10 × 10mg)',
  servingSize: '1 gummy (10mg THC)',
  servingsPerPackage: 10,
  thcPerServing: '10mg',
  thcPerPackage: '100mg',
  thcPercent: '10mg/serving',
  cbdPercent: '2mg/serving',
  terpenes: '1.8%',
  harvestDate: 'Feb 8, 2026',
  packageDate: 'Feb 24, 2026',
  expirationDate: 'Aug 24, 2026',
  description:
    'Hand-crafted blueberry gummies infused with full-spectrum Blue Dream extract. Each gummy delivers a consistent 10mg THC dose with natural blueberry flavor and no artificial colors.',
  labName: 'Bay State Testing Associates',
  labLicense: 'ML-000042',
  testDate: 'Feb 20, 2026',
  testStatus: 'passed',
  coaUrl: '#',
  labResults: [
    { testType: 'Potency', result: 'passed', value: '10.0', unit: 'mg/serving' },
    { testType: 'Pesticides', result: 'passed' },
    { testType: 'Heavy Metals', result: 'passed' },
    { testType: 'Microbials', result: 'passed' },
    { testType: 'Mycotoxins', result: 'passed' },
    { testType: 'Residual Solvents', result: 'passed' },
    { testType: 'Homogeneity', result: 'passed', value: '9.8–10.2', unit: 'mg range' },
    { testType: 'Foreign Matter', result: 'passed' },
  ],
  retailer: {
    name: 'Harbor House Collective',
    license: 'MR-000219',
    location: 'Chelsea, MA',
    purchaseDate: 'Mar 2, 2026',
  },
}
