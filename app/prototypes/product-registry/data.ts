export interface Brand {
  id: string
  name: string
  logoInitials: string
  orgName: string
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  type: string
  sku: string
  status: 'active' | 'archived'
  isBundle: boolean
  brandId: string
  retailId: string
  upc: string
  thcContent: string
  cbdContent: string
  weight: string
  ingredients: string
  allergens: string[]
  markets: { marketId: string; status: 'available' | 'pending' | 'restricted' }[]
  thumbnailUrl: string
  createdAt: string
  updatedAt: string
  bundleComponents?: { productId: string; productName: string; quantity: number }[]
}

export const brands: Brand[] = [
  { id: 'brand-001', name: 'Pacific Coast Extracts', logoInitials: 'PC', orgName: 'Pacific Coast Holdings LLC' },
  { id: 'brand-002', name: 'Green Leaf Cultivation', logoInitials: 'GL', orgName: 'Pacific Coast Holdings LLC' },
  { id: 'brand-003', name: 'Mountain View Wellness', logoInitials: 'MW', orgName: 'Mountain View Group Inc.' },
]

export const categories = [
  { value: 'flower', label: 'Flower' },
  { value: 'concentrate', label: 'Concentrate' },
  { value: 'edible', label: 'Edible' },
  { value: 'pre-roll', label: 'Pre-Roll' },
  { value: 'tincture', label: 'Tincture' },
  { value: 'topical', label: 'Topical' },
  { value: 'capsule', label: 'Capsule' },
]

export const productTypes: Record<string, { value: string; label: string }[]> = {
  flower: [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'greenhouse', label: 'Greenhouse' },
    { value: 'mixed-light', label: 'Mixed Light' },
  ],
  concentrate: [
    { value: 'live-resin', label: 'Live Resin' },
    { value: 'shatter', label: 'Shatter' },
    { value: 'wax', label: 'Wax' },
    { value: 'rosin', label: 'Rosin' },
    { value: 'distillate', label: 'Distillate' },
    { value: 'cartridge', label: 'Cartridge' },
  ],
  edible: [
    { value: 'gummy', label: 'Gummy' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'baked-good', label: 'Baked Good' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'hard-candy', label: 'Hard Candy' },
  ],
  'pre-roll': [
    { value: 'single', label: 'Single' },
    { value: 'multi-pack', label: 'Multi-Pack' },
    { value: 'infused', label: 'Infused' },
  ],
  tincture: [
    { value: 'oil', label: 'Oil' },
    { value: 'sublingual', label: 'Sublingual' },
  ],
  topical: [
    { value: 'cream', label: 'Cream' },
    { value: 'balm', label: 'Balm' },
    { value: 'patch', label: 'Patch' },
  ],
  capsule: [
    { value: 'softgel', label: 'Softgel' },
    { value: 'tablet', label: 'Tablet' },
  ],
}

export const marketOptions = [
  { value: 'CA', label: 'California' },
  { value: 'OR', label: 'Oregon' },
  { value: 'CO', label: 'Colorado' },
  { value: 'WA', label: 'Washington' },
  { value: 'NV', label: 'Nevada' },
  { value: 'MI', label: 'Michigan' },
  { value: 'IL', label: 'Illinois' },
  { value: 'MA', label: 'Massachusetts' },
]

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Blue Dream Premium Flower',
    description: 'Premium indoor-grown Blue Dream. Balanced hybrid with sweet berry aroma and full-body relaxation. Carefully cultivated in climate-controlled environments for maximum terpene expression.',
    category: 'flower',
    type: 'indoor',
    sku: 'PCE-FL-BD-001',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00142',
    upc: '850012345001',
    thcContent: '28.4%',
    cbdContent: '0.3%',
    weight: '3.5g',
    ingredients: 'Cannabis flower (Blue Dream)',
    allergens: [],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'OR', status: 'available' },
      { marketId: 'NV', status: 'pending' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-03-05T14:22:00Z',
  },
  {
    id: 'prod-002',
    name: 'OG Kush Live Resin',
    description: 'Flash-frozen, single-source live resin extracted from hand-selected OG Kush. Full-spectrum cannabinoid and terpene profile preserved through cold extraction process.',
    category: 'concentrate',
    type: 'live-resin',
    sku: 'PCE-CR-OGK-002',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00143',
    upc: '850012345002',
    thcContent: '82.1%',
    cbdContent: '1.2%',
    weight: '1g',
    ingredients: 'Cannabis extract (OG Kush)',
    allergens: [],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'CO', status: 'available' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-01-20T09:15:00Z',
    updatedAt: '2026-02-28T11:45:00Z',
  },
  {
    id: 'prod-003',
    name: 'Sour Diesel Pre-Roll 5-Pack',
    description: 'Five individually wrapped 0.5g pre-rolls of premium Sour Diesel. Machine-rolled with natural paper cones for consistent burn and smooth draw.',
    category: 'pre-roll',
    type: 'multi-pack',
    sku: 'PCE-PR-SD-003',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00144',
    upc: '850012345003',
    thcContent: '24.7%',
    cbdContent: '0.1%',
    weight: '2.5g',
    ingredients: 'Cannabis flower (Sour Diesel), natural paper cone',
    allergens: [],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'OR', status: 'available' },
      { marketId: 'WA', status: 'available' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-02-01T13:00:00Z',
    updatedAt: '2026-03-08T16:30:00Z',
  },
  {
    id: 'prod-004',
    name: 'Mango Bliss Gummies',
    description: 'Tropical mango-flavored gummies infused with full-spectrum cannabis extract. 10 pieces per package, 10mg THC each. Vegan, gluten-free formula.',
    category: 'edible',
    type: 'gummy',
    sku: 'PCE-ED-MBG-004',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00145',
    upc: '850012345004',
    thcContent: '100mg (10mg/piece)',
    cbdContent: '5mg',
    weight: '85g',
    ingredients: 'Sugar, tapioca syrup, water, pectin, citric acid, natural mango flavor, cannabis extract, coconut oil',
    allergens: ['Coconut'],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'OR', status: 'available' },
      { marketId: 'CO', status: 'available' },
      { marketId: 'MI', status: 'pending' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-03-01T10:15:00Z',
  },
  {
    id: 'prod-005',
    name: 'GSC Distillate Cartridge',
    description: 'Premium distillate vape cartridge featuring Girl Scout Cookies terpene profile. Compatible with standard 510-thread batteries. Lab-tested for purity and potency.',
    category: 'concentrate',
    type: 'cartridge',
    sku: 'PCE-CR-GSC-005',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00146',
    upc: '850012345005',
    thcContent: '91.3%',
    cbdContent: '0.5%',
    weight: '0.5g',
    ingredients: 'Cannabis distillate, natural terpenes',
    allergens: [],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'NV', status: 'available' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-02-15T11:30:00Z',
    updatedAt: '2026-03-06T09:45:00Z',
  },
  {
    id: 'prod-006',
    name: 'Rest & Recover Tincture',
    description: 'Full-spectrum CBD-dominant tincture with 2:1 CBD:THC ratio. MCT coconut oil base with natural peppermint flavor. Dropper cap for precise dosing.',
    category: 'tincture',
    type: 'oil',
    sku: 'PCE-TN-RR-006',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00147',
    upc: '850012345006',
    thcContent: '250mg',
    cbdContent: '500mg',
    weight: '30ml',
    ingredients: 'MCT coconut oil, cannabis extract, natural peppermint flavor',
    allergens: ['Coconut'],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'OR', status: 'available' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-04T12:00:00Z',
  },
  {
    id: 'prod-007',
    name: 'Jack Herer Shatter',
    description: 'Glass-like shatter produced from Jack Herer using hydrocarbon extraction. Known for uplifting, clear-headed effects with piney, citrus aroma.',
    category: 'concentrate',
    type: 'shatter',
    sku: 'PCE-CR-JH-007',
    status: 'archived',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00148',
    upc: '850012345007',
    thcContent: '78.5%',
    cbdContent: '0.8%',
    weight: '1g',
    ingredients: 'Cannabis extract (Jack Herer)',
    allergens: [],
    markets: [
      { marketId: 'CA', status: 'restricted' },
    ],
    thumbnailUrl: '',
    createdAt: '2025-11-05T10:00:00Z',
    updatedAt: '2026-01-20T16:00:00Z',
  },
  {
    id: 'prod-008',
    name: 'Pacific Coast Starter Bundle',
    description: 'Curated introduction to the Pacific Coast Extracts lineup. Includes our top-selling flower, pre-roll pack, and gummies at a bundled value.',
    category: 'flower',
    type: 'indoor',
    sku: 'PCE-BN-STR-008',
    status: 'active',
    isBundle: true,
    brandId: 'brand-001',
    retailId: 'RID-2026-00149',
    upc: '850012345008',
    thcContent: 'Varies by component',
    cbdContent: 'Varies by component',
    weight: 'Varies',
    ingredients: 'See component products',
    allergens: ['Coconut'],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'OR', status: 'available' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-09T15:30:00Z',
    bundleComponents: [
      { productId: 'prod-001', productName: 'Blue Dream Premium Flower', quantity: 1 },
      { productId: 'prod-003', productName: 'Sour Diesel Pre-Roll 5-Pack', quantity: 1 },
      { productId: 'prod-004', productName: 'Mango Bliss Gummies', quantity: 2 },
    ],
  },
  {
    id: 'prod-009',
    name: 'Granddaddy Purple Flower',
    description: 'Indica-dominant strain with deep purple hues and grape-forward aroma. Dense, trichome-covered buds grown in controlled indoor facilities.',
    category: 'flower',
    type: 'indoor',
    sku: 'PCE-FL-GDP-009',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00150',
    upc: '850012345009',
    thcContent: '26.1%',
    cbdContent: '0.2%',
    weight: '3.5g',
    ingredients: 'Cannabis flower (Granddaddy Purple)',
    allergens: [],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'MI', status: 'available' },
      { marketId: 'IL', status: 'pending' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-07T14:00:00Z',
  },
  {
    id: 'prod-010',
    name: 'Lavender Relief Balm',
    description: 'Soothing topical balm infused with full-spectrum cannabis extract and lavender essential oil. For external use only. Non-intoxicating.',
    category: 'topical',
    type: 'balm',
    sku: 'PCE-TP-LRB-010',
    status: 'active',
    isBundle: false,
    brandId: 'brand-001',
    retailId: 'RID-2026-00151',
    upc: '850012345010',
    thcContent: '100mg',
    cbdContent: '200mg',
    weight: '56g',
    ingredients: 'Beeswax, coconut oil, cannabis extract, lavender essential oil, vitamin E',
    allergens: ['Coconut'],
    markets: [
      { marketId: 'CA', status: 'available' },
      { marketId: 'OR', status: 'available' },
      { marketId: 'CO', status: 'available' },
    ],
    thumbnailUrl: '',
    createdAt: '2026-03-02T08:30:00Z',
    updatedAt: '2026-03-08T11:00:00Z',
  },
]

export const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]

export const typeFilterOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'single', label: 'Single Products' },
  { value: 'bundle', label: 'Bundles' },
]
