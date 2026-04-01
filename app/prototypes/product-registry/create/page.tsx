'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  shadowSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'
import {
  Button,
  Input,
  LinearStepper,
  ConfirmDialog,
  Toast,
  useToast,
  Checkbox,
  Badge,
  Divider,
  Banner,
} from '@/components'
import { Select } from '@/components/Select'
import { Textarea } from '@/components/Textarea'
import { categories, productTypes, marketOptions } from '../data'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

interface FormData {
  name: string
  description: string
  category: string
  type: string
  sku: string
  upc: string
  thcContent: string
  cbdContent: string
  weight: string
  weightUnit: string
  ingredients: string
  allergens: string[]
  markets: string[]
}

const allergenOptions = [
  'Coconut',
  'Soy',
  'Gluten',
  'Tree Nuts',
  'Peanuts',
  'Dairy',
  'Eggs',
  'Sesame',
]

export default function CreatePage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const toast = useToast()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    type: '',
    sku: '',
    upc: '',
    thcContent: '',
    cbdContent: '',
    weight: '',
    weightUnit: 'g',
    ingredients: '',
    allergens: [],
    markets: [],
  })

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const steps = [
    { label: 'Basic Info', description: 'Name, category, type' },
    { label: 'Identifiers', description: 'SKU, UPC' },
    { label: 'Specifications', description: 'THC, CBD, weight' },
    { label: 'Markets', description: 'Availability' },
    { label: 'Review', description: 'Confirm details' },
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Product name is required'
      if (!formData.category) newErrors.category = 'Category is required'
      if (!formData.type) newErrors.type = 'Type is required'
    }

    if (step === 3) {
      if (formData.markets.length === 0) newErrors.markets = 'At least one market is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false)
    toast.success(`"${formData.name}" has been created in the global registry.`)
    setTimeout(() => {
      window.location.href = '/prototypes/product-registry/catalog'
    }, 2000)
  }

  const typeOptions = formData.category ? productTypes[formData.category] || [] : []

  const sectionStyle: React.CSSProperties = {
    backgroundColor: colors.surface.light,
    borderRadius: borderRadiusSemantics.card,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    boxShadow: shadowSemantics.card,
    padding: isMobile ? spacing.md : spacing.xl,
  }

  const fieldGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: spacing.lg,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <a
            href="/prototypes/product-registry/catalog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing['2xs'],
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.action.enabled,
              textDecoration: 'none',
              marginBottom: spacing.xs,
            }}
          >
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Products
          </a>
          <h1
            style={{
              fontFamily: fontFamilies.display,
              fontSize: isMobile ? typography.heading.h4.fontSize : typography.heading.h3.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
              margin: 0,
            }}
          >
            Create Product
          </h1>
        </div>
      </div>

      {/* Error banner */}
      {viewState === 'error' && (
        <Banner
          variant="error"
          size="md"
          dismissible
          onDismiss={() => setViewState('default')}
        >
          Failed to save product. Please check your connection and try again, or contact support if the issue persists.
        </Banner>
      )}

      {/* Stepper */}
      <LinearStepper
        steps={steps.map((s, i) => ({
          id: `step-${i}`,
          label: s.label,
          description: isMobile ? undefined : s.description,
          status: (i < currentStep ? 'completed' : i === currentStep ? 'active' : 'upcoming') as 'completed' | 'active' | 'upcoming',
        }))}
        activeStep={currentStep}
      />

      {/* Form content */}
      <div style={sectionStyle}>
        {/* Step 0: Basic Info */}
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h5.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
              }}
            >
              Basic Information
            </h2>
            <Input
              label="Product Name *"
              placeholder="e.g., Blue Dream Premium Flower"
              value={formData.name}
              onChange={(val) => updateField('name', val)}
              error={!!errors.name}
              size="md"
            />
            {errors.name && (
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.xs.fontSize,
                  color: colors.status.important,
                  marginTop: `-${spacing.sm}`,
                }}
                role="alert"
              >
                {errors.name}
              </span>
            )}
            <Textarea
              label="Description"
              placeholder="Describe the product — origin, effects, key selling points..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              fullWidth
            />
            <div style={fieldGridStyle}>
              <Select
                label="Category *"
                options={categories}
                value={formData.category}
                onChange={(val) => {
                  updateField('category', val)
                  updateField('type', '')
                }}
                placeholder="Select category"
                error={!!errors.category}
                errorMessage={errors.category}
                fullWidth
              />
              <Select
                label="Type *"
                options={typeOptions}
                value={formData.type}
                onChange={(val) => updateField('type', val)}
                placeholder={formData.category ? 'Select type' : 'Select category first'}
                disabled={!formData.category}
                error={!!errors.type}
                errorMessage={errors.type}
                fullWidth
              />
            </div>
          </div>
        )}

        {/* Step 1: Identifiers */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h5.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
              }}
            >
              Product Identifiers
            </h2>
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: 0,
              }}
            >
              A Registry ID will be automatically assigned upon creation. You can optionally add your internal SKU and UPC.
            </p>
            <div style={fieldGridStyle}>
              <Input
                label="SKU (Internal)"
                placeholder="e.g., PCE-FL-BD-001"
                value={formData.sku}
                onChange={(val) => updateField('sku', val)}
                size="md"
              />
              <Input
                label="UPC / EAN"
                placeholder="e.g., 850012345001"
                value={formData.upc}
                onChange={(val) => updateField('upc', val)}
                size="md"
              />
            </div>
          </div>
        )}

        {/* Step 2: Specifications */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h5.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
              }}
            >
              Specifications
            </h2>
            <div style={fieldGridStyle}>
              <Input
                label="THC Content"
                placeholder="e.g., 28.4%"
                value={formData.thcContent}
                onChange={(val) => updateField('thcContent', val)}
                size="md"
              />
              <Input
                label="CBD Content"
                placeholder="e.g., 0.3%"
                value={formData.cbdContent}
                onChange={(val) => updateField('cbdContent', val)}
                size="md"
              />
            </div>
            <div style={fieldGridStyle}>
              <Input
                label="Weight"
                placeholder="e.g., 3.5"
                value={formData.weight}
                onChange={(val) => updateField('weight', val)}
                size="md"
              />
              <Select
                label="Unit"
                options={[
                  { value: 'g', label: 'Grams (g)' },
                  { value: 'oz', label: 'Ounces (oz)' },
                  { value: 'mg', label: 'Milligrams (mg)' },
                  { value: 'ml', label: 'Milliliters (ml)' },
                  { value: 'each', label: 'Each' },
                ]}
                value={formData.weightUnit}
                onChange={(val) => updateField('weightUnit', val)}
                fullWidth
              />
            </div>
            <Divider />
            <Textarea
              label="Ingredients"
              placeholder="List all ingredients..."
              value={formData.ingredients}
              onChange={(e) => updateField('ingredients', e.target.value)}
              rows={3}
              fullWidth
            />
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: fontFamilies.body,
                  fontSize: typography.label.sm.fontSize,
                  fontWeight: fontWeights.medium,
                  color: colors.text.highEmphasis.onLight,
                  marginBottom: spacing.xs,
                }}
              >
                Allergens
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: spacing.xs,
                }}
              >
                {allergenOptions.map((allergen) => (
                  <Checkbox
                    key={allergen}
                    label={allergen}
                    checked={formData.allergens.includes(allergen)}
                    onChange={(checked) => {
                      if (checked) {
                        updateField('allergens', [...formData.allergens, allergen])
                      } else {
                        updateField(
                          'allergens',
                          formData.allergens.filter((a) => a !== allergen),
                        )
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Markets */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h5.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
              }}
            >
              Market Availability
            </h2>
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: 0,
              }}
            >
              Select the markets where this product will be available. Market-specific compliance fields will be required before the product can be activated in each market.
            </p>
            {errors.markets && (
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.xs.fontSize,
                  color: colors.status.important,
                }}
                role="alert"
              >
                {errors.markets}
              </span>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: spacing.xs,
              }}
            >
              {marketOptions.map((market) => {
                const isSelected = formData.markets.includes(market.value)
                return (
                  <button
                    key={market.value}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        updateField(
                          'markets',
                          formData.markets.filter((m) => m !== market.value),
                        )
                      } else {
                        updateField('markets', [...formData.markets, market.value])
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      padding: spacing.md,
                      backgroundColor: isSelected ? colors.selectedHighlight : colors.surface.light,
                      border: `1px solid ${isSelected ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                      borderRadius: borderRadiusSemantics.card,
                      cursor: 'pointer',
                      fontFamily: fontFamilies.body,
                      fontSize: typography.body.sm.fontSize,
                      fontWeight: isSelected ? fontWeights.medium : fontWeights.regular,
                      color: colors.text.highEmphasis.onLight,
                      textAlign: 'left',
                      transition: `all ${transitionPresets.fast}`,
                    }}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `2px solid ${isSelected ? colors.brand.default : colors.border.midEmphasis.onLight}`,
                        backgroundColor: isSelected ? colors.brand.default : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {market.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h5.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
              }}
            >
              Review & Submit
            </h2>
            <Banner variant="warning" size="md">
              Creating this product will make it available as a source of truth across all connected systems. Please review carefully before submitting.
            </Banner>

            {/* Review summary */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.md.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.lowEmphasis.onLight,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    margin: `0 0 ${spacing.xs}`,
                  }}
                >
                  Basic Info
                </h3>
                <div style={fieldGridStyle}>
                  <ReviewField label="Name" value={formData.name || '—'} />
                  <ReviewField label="Category" value={formData.category ? formData.category.charAt(0).toUpperCase() + formData.category.slice(1) : '—'} />
                  <ReviewField label="Type" value={formData.type ? formData.type.charAt(0).toUpperCase() + formData.type.slice(1) : '—'} />
                </div>
                {formData.description && (
                  <div style={{ marginTop: spacing.sm }}>
                    <ReviewField label="Description" value={formData.description} />
                  </div>
                )}
              </div>

              <Divider />

              <div>
                <h3
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.md.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.lowEmphasis.onLight,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    margin: `0 0 ${spacing.xs}`,
                  }}
                >
                  Identifiers
                </h3>
                <div style={fieldGridStyle}>
                  <ReviewField label="SKU" value={formData.sku || 'Not set'} />
                  <ReviewField label="UPC" value={formData.upc || 'Not set'} />
                </div>
              </div>

              <Divider />

              <div>
                <h3
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.md.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.lowEmphasis.onLight,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    margin: `0 0 ${spacing.xs}`,
                  }}
                >
                  Specifications
                </h3>
                <div style={fieldGridStyle}>
                  <ReviewField label="THC" value={formData.thcContent || 'Not set'} />
                  <ReviewField label="CBD" value={formData.cbdContent || 'Not set'} />
                  <ReviewField label="Weight" value={formData.weight ? `${formData.weight} ${formData.weightUnit}` : 'Not set'} />
                  <ReviewField label="Allergens" value={formData.allergens.length > 0 ? formData.allergens.join(', ') : 'None'} />
                </div>
              </div>

              <Divider />

              <div>
                <h3
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.md.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.lowEmphasis.onLight,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    margin: `0 0 ${spacing.xs}`,
                  }}
                >
                  Markets
                </h3>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                  {formData.markets.length > 0 ? (
                    formData.markets.map((m) => {
                      const market = marketOptions.find((mo) => mo.value === m)
                      return (
                        <Badge key={m} color="success" variant="subtle" size="sm">
                          {market?.label ?? m}
                        </Badge>
                      )
                    })
                  ) : (
                    <span
                      style={{
                        fontFamily: fontFamilies.body,
                        fontSize: typography.body.sm.fontSize,
                        color: colors.text.lowEmphasis.onLight,
                      }}
                    >
                      No markets selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Button
          emphasis="low"
          size="md"
          onClick={() => {
            if (formData.name || formData.category) {
              setShowCancelDialog(true)
            } else {
              window.location.href = '/prototypes/product-registry/catalog'
            }
          }}
        >
          Cancel
        </Button>
        <div style={{ display: 'flex', gap: spacing.xs }}>
          {currentStep > 0 && (
            <Button emphasis="mid" size="md" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button emphasis="high" size="md" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              emphasis="high"
              size="md"
              onClick={handleSubmit}
              loading={viewState === 'loading'}
            >
              Submit Product
            </Button>
          )}
        </div>
      </div>

      {/* Confirm submission dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        title="Create product in global registry?"
        description={`"${formData.name}" will be registered as a source of truth across all connected systems. This includes POS integrations, compliance tracking, and market-specific data feeds. Are you sure?`}
        confirmLabel="Create Product"
        cancelLabel="Go Back"
        variant="info"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* Cancel confirmation dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        title="Discard unsaved changes?"
        description="You have unsaved product information. Leaving this page will discard all changes."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        variant="destructive"
        onConfirm={() => {
          window.location.href = '/prototypes/product-registry/catalog'
        }}
        onCancel={() => setShowCancelDialog(false)}
      />

      {/* Toast */}
      {toast.toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          message={t.message}
          isVisible
          onClose={() => toast.dismiss(t.id)}
        />
      ))}
      <PrototypeToolbar viewState={viewState} onViewStateChange={setViewState} />
    </div>
  )
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.md.fontSize,
          color: colors.text.highEmphasis.onLight,
        }}
      >
        {value}
      </span>
    </div>
  )
}
