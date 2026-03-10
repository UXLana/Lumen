// =============================================================================
// QR Verify Prototype — Mock Data
// =============================================================================

export interface LabResult {
  testType: string
  result: 'passed' | 'failed' | 'pending'
  value?: string
  unit?: string
}

export interface SupplyChainStep {
  role: string
  facilityName: string
  licenseNumber: string
  location: string
  date: string
  status: 'completed' | 'current'
}

export interface ProductData {
  id: string
  name: string
  brand: string
  category: string
  strain: string
  strainType: 'Indica' | 'Sativa' | 'Hybrid'
  packageTag: string
  batchId: string
  weight: string
  thc: string
  cbd: string
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
  supplyChain: SupplyChainStep[]
}

export interface BundleData {
  id: string
  name: string
  brand: string
  description: string
  packageTag: string
  packageDate: string
  totalItems: number
  products: ProductData[]
}

// ---------------------------------------------------------------------------
// Sample Product
// ---------------------------------------------------------------------------

export const sampleProduct: ProductData = {
  id: 'prod-001',
  name: 'Blue Dream Premium Flower',
  brand: 'Green Leaf Cultivation',
  category: 'Flower',
  strain: 'Blue Dream',
  strainType: 'Hybrid',
  packageTag: '1A4060300000022000012345',
  batchId: 'BATCH-2026-0142',
  weight: '3.5g',
  thc: '28.4%',
  cbd: '0.3%',
  terpenes: '3.2%',
  harvestDate: 'Feb 12, 2026',
  packageDate: 'Feb 18, 2026',
  expirationDate: 'Aug 18, 2026',
  description:
    'A sativa-dominant hybrid known for its balanced full-body relaxation and gentle cerebral invigoration. Dense, trichome-covered buds with sweet berry and earthy undertones.',
  labName: 'Emerald Analytics Testing',
  labLicense: 'C12-0000042-LIC',
  testDate: 'Feb 16, 2026',
  testStatus: 'passed',
  coaUrl: '#',
  labResults: [
    { testType: 'Potency', result: 'passed', value: '28.4', unit: '% THC' },
    { testType: 'Pesticides', result: 'passed' },
    { testType: 'Heavy Metals', result: 'passed' },
    { testType: 'Microbials', result: 'passed' },
    { testType: 'Mycotoxins', result: 'passed' },
    { testType: 'Residual Solvents', result: 'passed' },
    { testType: 'Moisture Content', result: 'passed', value: '11.2', unit: '%' },
    { testType: 'Foreign Matter', result: 'passed' },
  ],
  supplyChain: [
    {
      role: 'Cultivator',
      facilityName: 'Green Leaf Cultivation LLC',
      licenseNumber: 'C12-0000001-LIC',
      location: 'Humboldt County, CA',
      date: 'Feb 12, 2026',
      status: 'completed',
    },
    {
      role: 'Testing Lab',
      facilityName: 'Emerald Analytics Testing',
      licenseNumber: 'C12-0000042-LIC',
      location: 'Sacramento, CA',
      date: 'Feb 16, 2026',
      status: 'completed',
    },
    {
      role: 'Distributor',
      facilityName: 'Pacific Coast Extracts',
      licenseNumber: 'D-11223',
      location: 'Oakland, CA',
      date: 'Feb 20, 2026',
      status: 'completed',
    },
    {
      role: 'Retailer',
      facilityName: 'Mountain View Dispensary',
      licenseNumber: 'P-67890',
      location: 'Mountain View, CA',
      date: 'Feb 24, 2026',
      status: 'current',
    },
  ],
}

// ---------------------------------------------------------------------------
// Sample Bundle
// ---------------------------------------------------------------------------

const bundleProduct2: ProductData = {
  id: 'prod-002',
  name: 'OG Kush Live Resin',
  brand: 'Pacific Coast Extracts',
  category: 'Concentrate',
  strain: 'OG Kush',
  strainType: 'Indica',
  packageTag: '1A4060300000022000054321',
  batchId: 'BATCH-2026-0143',
  weight: '1g',
  thc: '82.6%',
  cbd: '0.1%',
  terpenes: '8.4%',
  harvestDate: 'Feb 8, 2026',
  packageDate: 'Feb 19, 2026',
  expirationDate: 'Aug 19, 2026',
  description:
    'Premium live resin extracted from fresh-frozen OG Kush flower. Preserves the full terpene profile for a robust, authentic experience.',
  labName: 'Emerald Analytics Testing',
  labLicense: 'C12-0000042-LIC',
  testDate: 'Feb 15, 2026',
  testStatus: 'passed',
  coaUrl: '#',
  labResults: [
    { testType: 'Potency', result: 'passed', value: '82.6', unit: '% THC' },
    { testType: 'Pesticides', result: 'passed' },
    { testType: 'Heavy Metals', result: 'passed' },
    { testType: 'Microbials', result: 'passed' },
    { testType: 'Residual Solvents', result: 'passed' },
  ],
  supplyChain: [
    {
      role: 'Cultivator',
      facilityName: 'Green Leaf Cultivation LLC',
      licenseNumber: 'C12-0000001-LIC',
      location: 'Humboldt County, CA',
      date: 'Feb 8, 2026',
      status: 'completed',
    },
    {
      role: 'Manufacturer',
      facilityName: 'Pacific Coast Extracts',
      licenseNumber: 'M-12345',
      location: 'Oakland, CA',
      date: 'Feb 12, 2026',
      status: 'completed',
    },
    {
      role: 'Testing Lab',
      facilityName: 'Emerald Analytics Testing',
      licenseNumber: 'C12-0000042-LIC',
      location: 'Sacramento, CA',
      date: 'Feb 15, 2026',
      status: 'completed',
    },
    {
      role: 'Retailer',
      facilityName: 'Mountain View Dispensary',
      licenseNumber: 'P-67890',
      location: 'Mountain View, CA',
      date: 'Feb 24, 2026',
      status: 'current',
    },
  ],
}

const bundleProduct3: ProductData = {
  id: 'prod-003',
  name: 'Sour Diesel Pre-Roll 5-Pack',
  brand: 'Green Leaf Cultivation',
  category: 'Pre-Roll',
  strain: 'Sour Diesel',
  strainType: 'Sativa',
  packageTag: '1A4060300000022000067890',
  batchId: 'BATCH-2026-0144',
  weight: '3.5g (5 × 0.7g)',
  thc: '24.1%',
  cbd: '0.2%',
  terpenes: '2.8%',
  harvestDate: 'Feb 10, 2026',
  packageDate: 'Feb 19, 2026',
  expirationDate: 'Aug 19, 2026',
  description:
    'Five perfectly rolled joints made from hand-trimmed Sour Diesel flower. Energizing sativa with pungent diesel and citrus notes.',
  labName: 'Emerald Analytics Testing',
  labLicense: 'C12-0000042-LIC',
  testDate: 'Feb 14, 2026',
  testStatus: 'passed',
  coaUrl: '#',
  labResults: [
    { testType: 'Potency', result: 'passed', value: '24.1', unit: '% THC' },
    { testType: 'Pesticides', result: 'passed' },
    { testType: 'Heavy Metals', result: 'passed' },
    { testType: 'Microbials', result: 'passed' },
  ],
  supplyChain: [
    {
      role: 'Cultivator',
      facilityName: 'Green Leaf Cultivation LLC',
      licenseNumber: 'C12-0000001-LIC',
      location: 'Humboldt County, CA',
      date: 'Feb 10, 2026',
      status: 'completed',
    },
    {
      role: 'Testing Lab',
      facilityName: 'Emerald Analytics Testing',
      licenseNumber: 'C12-0000042-LIC',
      location: 'Sacramento, CA',
      date: 'Feb 14, 2026',
      status: 'completed',
    },
    {
      role: 'Retailer',
      facilityName: 'Mountain View Dispensary',
      licenseNumber: 'P-67890',
      location: 'Mountain View, CA',
      date: 'Feb 24, 2026',
      status: 'current',
    },
  ],
}

export const sampleBundle: BundleData = {
  id: 'bundle-001',
  name: 'Weekend Sampler Pack',
  brand: 'Mountain View Dispensary',
  description:
    'A curated selection of premium flower, concentrate, and pre-rolls — three top strains for every occasion.',
  packageTag: '1A4060300000022000099999',
  packageDate: 'Feb 24, 2026',
  totalItems: 3,
  products: [sampleProduct, bundleProduct2, bundleProduct3],
}
