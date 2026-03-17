// =============================================================================
// RID Tag Generator — Mock Data
// =============================================================================

export interface TagTemplate {
  id: string
  name: string
  description: string
  tagType: 'plant' | 'package' | 'transfer'
  tagsPerReel: number
  lastUsed: string | null
  migrated: boolean
  customLogic: boolean
  createdBy: string
  createdDate: string
}

export interface ReelCalculation {
  totalQuantity: number
  tagsPerReel: number
  reelCount: number
  remainder: number
}

export interface GeneratedOrder {
  orderId: string
  templateId: string
  templateName: string
  totalTags: number
  reels: number
  tagsPerReel: number
  lastReelCount: number
  outputFormat: 'csv' | 'csv+pdf'
  generatedAt: string
  status: 'pending' | 'generating' | 'complete' | 'failed'
  csvUrl: string | null
  pdfUrl: string | null
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const templates: TagTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Standard Plant Tag',
    description: 'Default plant tag with QR code, Metrc logo, and 1A4 barcode. Used for immature and vegetative plants.',
    tagType: 'plant',
    tagsPerReel: 20,
    lastUsed: '2026-03-12',
    migrated: false,
    customLogic: false,
    createdBy: 'James Wilson',
    createdDate: '2026-01-15',
  },
  {
    id: 'tpl-002',
    name: 'Package Tag — Flower',
    description: 'Package identification tag with QR code, product category badge, and weight field. Optimized for flower products.',
    tagType: 'package',
    tagsPerReel: 25,
    lastUsed: '2026-03-14',
    migrated: false,
    customLogic: false,
    createdBy: 'James Wilson',
    createdDate: '2026-02-01',
  },
  {
    id: 'tpl-003',
    name: 'Legacy Transfer Manifest',
    description: 'Migrated from RID v1. Includes custom barcode positioning and extended data fields per Oregon compliance requirements.',
    tagType: 'transfer',
    tagsPerReel: 15,
    lastUsed: '2026-03-10',
    migrated: true,
    customLogic: true,
    createdBy: 'System Migration',
    createdDate: '2025-08-20',
  },
  {
    id: 'tpl-004',
    name: 'Package Tag — Concentrate',
    description: 'Package tag variant for concentrates. Includes additional potency and extraction method fields.',
    tagType: 'package',
    tagsPerReel: 25,
    lastUsed: '2026-02-28',
    migrated: false,
    customLogic: false,
    createdBy: 'Sarah Rodriguez',
    createdDate: '2026-02-10',
  },
  {
    id: 'tpl-005',
    name: 'Legacy Plant Tag — Custom',
    description: 'Migrated from RID v1 with custom field mapping for Colorado cultivation facilities. Includes strain ID encoding.',
    tagType: 'plant',
    tagsPerReel: 20,
    lastUsed: null,
    migrated: true,
    customLogic: true,
    createdBy: 'System Migration',
    createdDate: '2025-08-20',
  },
]

// ---------------------------------------------------------------------------
// Sample Generated Orders (for regulator review use case)
// ---------------------------------------------------------------------------

export const sampleOrders: GeneratedOrder[] = [
  {
    orderId: 'ORD-2026-0341',
    templateId: 'tpl-001',
    templateName: 'Standard Plant Tag',
    totalTags: 500,
    reels: 25,
    tagsPerReel: 20,
    lastReelCount: 20,
    outputFormat: 'csv+pdf',
    generatedAt: '2026-03-15T14:23:00Z',
    status: 'complete',
    csvUrl: '/downloads/ORD-2026-0341.csv',
    pdfUrl: '/downloads/ORD-2026-0341.pdf',
  },
  {
    orderId: 'ORD-2026-0342',
    templateId: 'tpl-002',
    templateName: 'Package Tag — Flower',
    totalTags: 1200,
    reels: 48,
    tagsPerReel: 25,
    lastReelCount: 25,
    outputFormat: 'csv',
    generatedAt: '2026-03-15T16:45:00Z',
    status: 'complete',
    csvUrl: '/downloads/ORD-2026-0342.csv',
    pdfUrl: null,
  },
  {
    orderId: 'ORD-2026-0343',
    templateId: 'tpl-003',
    templateName: 'Legacy Transfer Manifest',
    totalTags: 300,
    reels: 20,
    tagsPerReel: 15,
    lastReelCount: 15,
    outputFormat: 'csv+pdf',
    generatedAt: '2026-03-16T09:10:00Z',
    status: 'pending',
    csvUrl: null,
    pdfUrl: null,
  },
]

// ---------------------------------------------------------------------------
// Tag type display labels and colors
// ---------------------------------------------------------------------------

export const tagTypeLabels: Record<string, string> = {
  plant: 'Plant',
  package: 'Package',
  transfer: 'Transfer',
}

export const tagTypeColors: Record<string, 'success' | 'info' | 'warning'> = {
  plant: 'success',
  package: 'info',
  transfer: 'warning',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function calculateReels(totalQuantity: number, tagsPerReel: number): ReelCalculation {
  if (totalQuantity <= 0 || tagsPerReel <= 0) {
    return { totalQuantity: 0, tagsPerReel: 0, reelCount: 0, remainder: 0 }
  }
  const reelCount = Math.ceil(totalQuantity / tagsPerReel)
  const remainder = totalQuantity % tagsPerReel
  return { totalQuantity, tagsPerReel, reelCount, remainder: remainder === 0 ? tagsPerReel : remainder }
}
