'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  colors,
  typography,
  fontFamilies,
  spacing,
  borderRadius,
  shadows,
  button as buttonTokens,
} from '@/styles/design-tokens';

// ============================================================================
// Prototype-local color overrides
// ============================================================================

const PROTO = {
  /** Primary brand / focus color for this flow */
  primary: '#328173',
  /** Focus ring: 3px, 80% opacity */
  focusRing: 'rgba(50, 129, 115, 0.80)',
  /** Selected card highlight: 3% opacity black */
  selectedHighlight: 'rgba(0, 0, 0, 0.03)',
  /** Input focus glow (subtle primary) */
  inputFocusGlow: 'rgba(50, 129, 115, 0.15)',
} as const;

// ============================================================================
// Types
// ============================================================================

interface Product {
  id: string;
  name: string;
  sku: string;
  imageUrl: string;
  brand: string;
  category: string;
  potency: string;
  markets: string[];
  totalMarkets: number;
}

type Step = 'empty' | 'results' | 'selected' | 'detail';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cannabis-Infused Blood Raspberries',
    sku: '12345-NO-567890',
    // Drop the Wyld image at public/prototypes/product-search/wyld-boysenberry.png
    imageUrl: '/prototypes/product-search/wyld-boysenberry.png',
    brand: 'Wyld',
    category: 'Edibles',
    potency: 'THC 22%',
    markets: ['CA', 'NV'],
    totalMarkets: 2,
  },
  {
    id: '2',
    name: 'Blue Dream Pre-Roll Pack',
    sku: '67890-PR-123456',
    imageUrl: '',
    brand: 'Raw Garden',
    category: 'Pre-Rolls',
    potency: 'THC 28%',
    markets: ['CA', 'OR', 'WA'],
    totalMarkets: 3,
  },
  {
    id: '3',
    name: 'Sativa Gummy Bears 10mg',
    sku: '11111-ED-222222',
    imageUrl: '',
    brand: 'Kiva',
    category: 'Edibles',
    potency: 'THC 10mg',
    markets: ['CA', 'NV', 'CO', 'IL'],
    totalMarkets: 4,
  },
];

// ============================================================================
// Icons
// ============================================================================

function SearchIcon({ size = 20, color = 'rgba(0,0,0,0.43)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke={color}
        strokeWidth="1.66"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClearIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
        fill="rgba(0,0,0,0.15)"
      />
      <path d="M7 7L13 13M13 7L7 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5L15 15M15 5L5 15" stroke="rgba(0,0,0,0.55)" strokeWidth="1.66" strokeLinecap="round" />
    </svg>
  );
}

function ProductPlaceholderIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="8" fill="#E8E0D8" />
      <path
        d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM24 32C19.59 32 16 28.41 16 24C16 19.59 19.59 16 24 16C28.41 16 32 19.59 32 24C32 28.41 28.41 32 24 32Z"
        fill="rgba(0,0,0,0.15)"
      />
      <circle cx="24" cy="24" r="4" fill="rgba(0,0,0,0.12)" />
    </svg>
  );
}

// ============================================================================
// ProductImage — renders real image or placeholder
// ============================================================================

function ProductImage({ src, size = 64 }: { src: string; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: borderRadius.md,
          background: '#F0EBE4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <ProductPlaceholderIcon />
      </div>
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: borderRadius.md,
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

// ============================================================================
// ProductResultCard
// ============================================================================

function ProductResultCard({
  product,
  isSelected,
  onSelect,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        width: '100%',
        background: isSelected ? PROTO.selectedHighlight : '#FFFFFF',
        border: `1px solid ${isSelected ? PROTO.primary : colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.lg,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 200ms ease-out',
        outline: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 3px ${PROTO.focusRing}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Radio */}
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: isSelected ? 'none' : `2px solid ${colors.border.highEmphasis.onLight}`,
          background: isSelected ? PROTO.primary : '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {isSelected && (
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#FFFFFF',
            }}
          />
        )}
      </div>

      {/* Product Image */}
      <ProductImage src={product.imageUrl} size={64} />

      {/* Product Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            ...typography.label.lg,
            color: colors.text.highEmphasis.onLight,
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            ...typography.body.xs,
            color: colors.text.lowEmphasis.onLight,
            marginBottom: '8px',
          }}
        >
          {product.sku}
        </div>

        {/* Metadata rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <MetadataRow label="Brands" value={product.brand} />
          <MetadataRow label="Category & potency">
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <MetaBadge>{product.category}</MetaBadge>
              <MetaBadge>{product.potency}</MetaBadge>
            </div>
          </MetadataRow>
          <MetadataRow label="Markets">
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {product.markets.map((m) => (
                <MarketBadge key={m} code={m} highlighted />
              ))}
              <span
                style={{
                  ...typography.body.xs,
                  color: colors.text.lowEmphasis.onLight,
                  marginLeft: '8px',
                }}
              >
                {product.totalMarkets}/{product.totalMarkets} Markets
              </span>
            </div>
          </MetadataRow>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// ProductDetailView
// ============================================================================

function ProductDetailView({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: borderRadius.lg,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        overflow: 'hidden',
      }}
    >
      {/* Header with close */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '16px 16px 0 16px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
          {/* Product Image - larger */}
          <ProductImage src={product.imageUrl} size={100} />

          {/* Title + SKU */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                ...typography.label.lg,
                color: colors.text.highEmphasis.onLight,
                marginBottom: '4px',
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                ...typography.body.xs,
                color: colors.text.lowEmphasis.onLight,
              }}
            >
              {product.sku}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 200ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          aria-label="Close product detail"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      {/* Metadata */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <MetadataRow label="Brands" value={product.brand} />
        <MetadataRow label="Category & potency">
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <MetaBadge>{product.category}</MetaBadge>
            <MetaBadge>{product.potency}</MetaBadge>
          </div>
        </MetadataRow>
        <MetadataRow label="Markets">
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {product.markets.map((m) => (
              <MarketBadge key={m} code={m} highlighted />
            ))}
            <span
              style={{
                ...typography.body.xs,
                color: colors.text.lowEmphasis.onLight,
                marginLeft: '8px',
              }}
            >
              {product.totalMarkets}/{product.totalMarkets} Markets
            </span>
          </div>
        </MetadataRow>
      </div>
    </div>
  );
}

// ============================================================================
// Shared Components
// ============================================================================

function MetadataRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div
        style={{
          ...typography.body.xs,
          color: colors.text.lowEmphasis.onLight,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {value ? (
        <div style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>
          {value}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: borderRadius.sm,
        background: colors.surface.lightDarker,
        ...typography.body.xs,
        fontWeight: 500,
        color: colors.text.highEmphasis.onLight,
      }}
    >
      {children}
    </span>
  );
}

function MarketBadge({ code, highlighted }: { code: string; highlighted?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '28px',
        height: '22px',
        padding: '2px 6px',
        borderRadius: borderRadius.sm,
        background: highlighted ? '#78CFB8' : colors.surface.lightDarker,
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: fontFamilies.body,
        color: highlighted ? '#0B1E19' : colors.text.highEmphasis.onLight,
      }}
    >
      {code}
    </span>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ProductSearchPrototype() {
  const [currentStep, setCurrentStep] = useState<Step>('empty');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter products on search
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      if (selectedProduct) {
        setCurrentStep('selected');
      } else {
        setCurrentStep('results');
      }
    } else if (searchQuery.length > 0) {
      setFilteredProducts([]);
      setCurrentStep('results');
    } else {
      setFilteredProducts([]);
      setSelectedProduct(null);
      setCurrentStep('empty');
    }
  }, [searchQuery, selectedProduct]);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentStep('selected');
  };

  const handleViewDetail = () => {
    if (selectedProduct) {
      setCurrentStep('detail');
    }
  };

  const handleCloseDetail = () => {
    setCurrentStep('selected');
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedProduct(null);
    setCurrentStep('empty');
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    setSearchQuery('');
    setSelectedProduct(null);
    setCurrentStep('empty');
  };

  const handleNext = () => {
    if (selectedProduct && currentStep === 'selected') {
      handleViewDetail();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.brand.darker,
        fontFamily: fontFamilies.body,
        padding: '40px 24px',
      }}
    >
      {/* Page header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 32px' }}>
        <h1
          style={{
            ...typography.heading.h3,
            color: colors.text.highEmphasis.onDark,
            marginBottom: '8px',
          }}
        >
          Find or Create Product
        </h1>
        <p
          style={{
            ...typography.body.md,
            color: colors.text.lowEmphasis.onDark,
            marginBottom: '24px',
          }}
        >
          Interactive prototype — Step through the product search flow
        </p>

        {/* Step indicator pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {(['empty', 'results', 'selected', 'detail'] as Step[]).map((step) => (
            <button
              key={step}
              onClick={() => {
                if (step === 'empty') handleCancel();
                else if (step === 'results') {
                  setSearchQuery('12345');
                  setSelectedProduct(null);
                  setCurrentStep('results');
                } else if (step === 'selected') {
                  setSearchQuery('12345');
                  setSelectedProduct(MOCK_PRODUCTS[0]);
                  setCurrentStep('selected');
                } else if (step === 'detail') {
                  setSearchQuery('12345');
                  setSelectedProduct(MOCK_PRODUCTS[0]);
                  setCurrentStep('detail');
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: borderRadius.full,
                border: 'none',
                background:
                  currentStep === step
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.15)',
                color:
                  currentStep === step
                    ? colors.brand.darker
                    : 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: fontFamilies.body,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                textTransform: 'capitalize',
              }}
            >
              {step === 'empty' ? '1. Empty' : step === 'results' ? '2. Results' : step === 'selected' ? '3. Selected' : '4. Detail'}
            </button>
          ))}
        </div>
      </div>

      {/* Card Container */}
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: shadows.xl,
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <div style={{ padding: '24px 24px 0 24px' }}>
            <h2
              style={{
                ...typography.heading.h4,
                color: colors.text.highEmphasis.onLight,
                marginBottom: '4px',
              }}
            >
              Find or create new product
            </h2>
            <p
              style={{
                ...typography.body.sm,
                color: colors.text.lowEmphasis.onLight,
                marginBottom: '20px',
              }}
            >
              Look for the product in Metrc database or create a new one
            </p>

            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <SearchIcon
                  size={20}
                  color={
                    searchQuery
                      ? colors.text.highEmphasis.onLight
                      : 'rgba(0,0,0,0.43)'
                  }
                />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Start typing license number"
                style={{
                  width: '100%',
                  height: '44px',
                  paddingLeft: '42px',
                  paddingRight: searchQuery ? '42px' : '14px',
                  border: `1px solid ${
                    searchQuery
                      ? colors.border.highEmphasis.onLight
                      : colors.border.lowEmphasis.onLight
                  }`,
                  borderRadius: borderRadius.md,
                  ...typography.body.md,
                  color: colors.text.highEmphasis.onLight,
                  outline: 'none',
                  transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
                  background: '#FFFFFF',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = PROTO.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${PROTO.focusRing}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = searchQuery
                    ? colors.border.highEmphasis.onLight
                    : colors.border.lowEmphasis.onLight;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Clear search"
                >
                  <ClearIcon size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Results Area */}
          {currentStep !== 'detail' && (
            <div
              style={{
                padding: '16px 24px',
                maxHeight: '320px',
                overflowY: 'auto',
              }}
            >
              {currentStep === 'empty' && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    color: colors.text.lowEmphasis.onLight,
                    ...typography.body.sm,
                  }}
                >
                  {/* Empty - no results shown */}
                </div>
              )}

              {(currentStep === 'results' || currentStep === 'selected') &&
                filteredProducts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredProducts.map((product) => (
                      <ProductResultCard
                        key={product.id}
                        product={product}
                        isSelected={selectedProduct?.id === product.id}
                        onSelect={() => handleSelect(product)}
                      />
                    ))}
                  </div>
                )}

              {(currentStep === 'results' || currentStep === 'selected') &&
                searchQuery.length >= 3 &&
                filteredProducts.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '24px 0',
                      color: colors.text.lowEmphasis.onLight,
                      ...typography.body.sm,
                    }}
                  >
                    No products found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
            </div>
          )}

          {/* Detail View */}
          {currentStep === 'detail' && selectedProduct && (
            <div style={{ padding: '16px 24px' }}>
              <ProductDetailView
                product={selectedProduct}
                onClose={handleCloseDetail}
              />
            </div>
          )}

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '16px 24px 24px',
              justifyContent: currentStep === 'detail' ? 'center' : 'flex-start',
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: buttonTokens.borderRadius,
                border: 'none',
                background: buttonTokens.emphasis.mid.enabled.background,
                color: buttonTokens.emphasis.mid.enabled.text,
                ...buttonTokens.typography.md,
                fontFamily: fontFamilies.body,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  buttonTokens.emphasis.mid.hover.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  buttonTokens.emphasis.mid.enabled.background;
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${PROTO.focusRing}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedProduct}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: buttonTokens.borderRadius,
                border: 'none',
                background: selectedProduct
                  ? PROTO.primary
                  : buttonTokens.emphasis.high.disabled.background,
                color: selectedProduct
                  ? '#FFFFFF'
                  : buttonTokens.emphasis.high.disabled.text,
                ...buttonTokens.typography.md,
                fontFamily: fontFamilies.body,
                cursor: selectedProduct ? 'pointer' : 'not-allowed',
                transition: 'all 200ms ease-out',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedProduct) {
                  e.currentTarget.style.background = '#2A6D61';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedProduct) {
                  e.currentTarget.style.background = PROTO.primary;
                } else {
                  e.currentTarget.style.background =
                    buttonTokens.emphasis.high.disabled.background;
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${PROTO.focusRing}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* Helper text */}
        <p
          style={{
            ...typography.body.xs,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            marginTop: '16px',
          }}
        >
          Try searching &ldquo;cannabis&rdquo;, &ldquo;12345&rdquo;, or &ldquo;wyld&rdquo; to see results
        </p>
      </div>
    </div>
  );
}
