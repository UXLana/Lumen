'use client';

import { useState, useCallback } from 'react';
import {
  colors,
  typography,
  fontFamilies,
  spacing,
  shadows,
  borderRadius,
  button as buttonTokens,
  sidebar as sidebarTokens,
  header as headerTokens,
  tab as tabTokens,
  banner as bannerTokens,
  pagination as paginationTokens,
} from '@/styles/design-tokens';

// =============================================================================
// TYPES
// =============================================================================

type Screen =
  | { type: 'home' }
  | { type: 'catalog' }
  | { type: 'detail'; productId: string }
  | { type: 'create' }
  | { type: 'createBundle' }
  | { type: 'edit'; productId: string }
  | { type: 'editBundle'; productId: string }
  | { type: 'brandManagement' };

type ModalState =
  | null
  | { type: 'archive'; productId: string; productName: string; isBundle: boolean; componentCount?: number }
  | { type: 'confirmCreate'; productName: string }
  | { type: 'confirmEdit'; productName: string }
  | { type: 'confirmBundle'; productName: string }
  | { type: 'successToast'; message: string };

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  productType: string;
  sku: string;
  status: 'active' | 'archived';
  isBundle: boolean;
  brand: string;
  thumbnailUrl?: string;
  retailId: string;
  thcContent?: string;
  cbdContent?: string;
  weight?: string;
  ingredients?: string;
  markets: string[];
  updatedAt: string;
  components?: { productId: string; productName: string; quantity: number }[];
}

interface Brand {
  id: string;
  name: string;
  description: string;
  logoInitial: string;
  productCount: number;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const BRANDS: Brand[] = [
  { id: 'b1', name: 'Wyld', description: 'Premium cannabis-infused edibles crafted with real fruit', logoInitial: 'W', productCount: 34 },
  { id: 'b2', name: 'Holistic Industries', description: 'Multi-state cannabis company focused on health & wellness', logoInitial: 'H', productCount: 52 },
  { id: 'b3', name: 'Autumn Brands', description: 'Sun-grown, sustainably farmed cannabis', logoInitial: 'A', productCount: 18 },
];

const PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Wyld Raspberry Gummies', description: 'Real fruit, cannabis-infused raspberry gummies. 10 pieces per package, 100mg total THC.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-RSP-100', status: 'active', isBundle: false,
    brand: 'Wyld', retailId: 'RID-00234821', thcContent: '100mg', cbdContent: '0mg', weight: '85g',
    ingredients: 'Raspberry puree, sugar, gelatin, citric acid, cannabis extract, natural flavors',
    markets: ['CA', 'CO', 'OR', 'NV', 'AZ', 'MI'], updatedAt: '2026-02-10',
  },
  {
    id: 'p2', name: 'Wyld Elderberry Gummies', description: 'CBD-rich elderberry gummies for wellness. 20:1 CBD:THC ratio.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-ELD-CBD', status: 'active', isBundle: false,
    brand: 'Wyld', retailId: 'RID-00234822', thcContent: '5mg', cbdContent: '100mg', weight: '85g',
    ingredients: 'Elderberry puree, sugar, gelatin, citric acid, hemp extract, natural flavors',
    markets: ['CA', 'CO', 'OR'], updatedAt: '2026-02-08',
  },
  {
    id: 'p3', name: 'Wyld Marionberry Gummies', description: 'Indica-enhanced marionberry gummies for evening relaxation.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-MAR-IND', status: 'active', isBundle: false,
    brand: 'Wyld', retailId: 'RID-00234823', thcContent: '100mg', cbdContent: '0mg', weight: '85g',
    ingredients: 'Marionberry puree, sugar, gelatin, citric acid, cannabis extract',
    markets: ['CA', 'CO', 'OR', 'NV'], updatedAt: '2026-02-05',
  },
  {
    id: 'p4', name: 'Wyld Pear Gummies', description: 'Sativa-enhanced pear gummies with uplifting effects.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-PER-SAT', status: 'active', isBundle: false,
    brand: 'Wyld', retailId: 'RID-00234824', thcContent: '100mg', cbdContent: '0mg', weight: '85g',
    ingredients: 'Pear puree, sugar, gelatin, citric acid, cannabis extract, natural flavors',
    markets: ['CA', 'OR', 'NV', 'MI'], updatedAt: '2026-01-28',
  },
  {
    id: 'p5', name: 'Wyld Huckleberry Gummies', description: 'Hybrid huckleberry gummies for balanced effects.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-HCK-HYB', status: 'active', isBundle: false,
    brand: 'Wyld', retailId: 'RID-00234825', thcContent: '100mg', cbdContent: '0mg', weight: '85g',
    ingredients: 'Huckleberry puree, sugar, gelatin, citric acid, cannabis extract',
    markets: ['CA', 'CO', 'OR', 'NV', 'AZ'], updatedAt: '2026-01-25',
  },
  {
    id: 'p6', name: 'Wyld Pomegranate Gummies', description: 'THC:CBN pomegranate gummies for sleep support.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-POM-CBN', status: 'active', isBundle: false,
    brand: 'Wyld', retailId: 'RID-00234826', thcContent: '50mg', cbdContent: '0mg', weight: '85g',
    ingredients: 'Pomegranate puree, sugar, gelatin, citric acid, cannabis extract, CBN isolate',
    markets: ['CA', 'CO'], updatedAt: '2026-01-20',
  },
  {
    id: 'p7', name: 'Wyld Variety Pack', description: 'Sampler of 4 bestselling flavors: Raspberry, Marionberry, Pear, and Huckleberry.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-VAR-4PK', status: 'active', isBundle: true,
    brand: 'Wyld', retailId: 'RID-00234830', thcContent: '400mg total', weight: '340g',
    markets: ['CA', 'OR'], updatedAt: '2026-02-11',
    components: [
      { productId: 'p1', productName: 'Wyld Raspberry Gummies', quantity: 1 },
      { productId: 'p3', productName: 'Wyld Marionberry Gummies', quantity: 1 },
      { productId: 'p4', productName: 'Wyld Pear Gummies', quantity: 1 },
      { productId: 'p5', productName: 'Wyld Huckleberry Gummies', quantity: 1 },
    ],
  },
  {
    id: 'p8', name: 'Wyld Raspberry 3-Pack', description: 'Triple pack of our bestselling Raspberry Gummies.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-RSP-3PK', status: 'active', isBundle: true,
    brand: 'Wyld', retailId: 'RID-00234831', thcContent: '300mg total', weight: '255g',
    markets: ['CA', 'CO', 'OR', 'NV'], updatedAt: '2026-02-09',
    components: [
      { productId: 'p1', productName: 'Wyld Raspberry Gummies', quantity: 3 },
    ],
  },
  {
    id: 'p9', name: 'Wyld Blood Orange Gummies', description: 'Discontinued blood orange flavor.',
    category: 'Edibles', productType: 'Gummies', sku: 'WYL-BOR-HYB', status: 'archived', isBundle: false,
    brand: 'Wyld', retailId: 'RID-00234827', thcContent: '100mg', weight: '85g',
    markets: ['CA'], updatedAt: '2025-11-15',
  },
];

const CATEGORIES = ['Edibles', 'Flower', 'Concentrates', 'Topicals', 'Pre-Rolls', 'Vape', 'Tinctures', 'Beverages'];
const PRODUCT_TYPES: Record<string, string[]> = {
  'Edibles': ['Gummies', 'Chocolates', 'Baked Goods', 'Hard Candy', 'Mints', 'Capsules'],
  'Flower': ['Indica', 'Sativa', 'Hybrid', 'CBD'],
  'Concentrates': ['Wax', 'Shatter', 'Live Resin', 'Rosin', 'Distillate'],
  'Pre-Rolls': ['Single', 'Multi-Pack', 'Infused'],
  'Vape': ['Cartridge', 'Disposable', 'Pod'],
  'Tinctures': ['Full Spectrum', 'Broad Spectrum', 'Isolate'],
  'Topicals': ['Balm', 'Lotion', 'Patch', 'Oil'],
  'Beverages': ['Sparkling', 'Still', 'Shot', 'Powder Mix'],
};
const MARKETS = ['CA', 'CO', 'OR', 'NV', 'AZ', 'MI', 'IL', 'MA', 'NY', 'FL', 'OH', 'MD'];

const RECENT_ACTIVITY: { id: string; action: 'created' | 'updated' | 'archived'; productName: string; user: string; timestamp: string }[] = [
  { id: 'a1', action: 'created', productName: 'Wyld Variety Pack', user: 'LH', timestamp: '2026-02-11' },
  { id: 'a2', action: 'updated', productName: 'Wyld Raspberry Gummies', user: 'LH', timestamp: '2026-02-10' },
  { id: 'a3', action: 'updated', productName: 'Wyld Raspberry 3-Pack', user: 'JD', timestamp: '2026-02-09' },
  { id: 'a4', action: 'updated', productName: 'Wyld Elderberry Gummies', user: 'LH', timestamp: '2026-02-08' },
  { id: 'a5', action: 'archived', productName: 'Wyld Blood Orange Gummies', user: 'LH', timestamp: '2025-11-15' },
];

// =============================================================================
// SHARED STYLES
// =============================================================================

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  padding: '8px 12px',
  border: `1px solid ${colors.border.midEmphasis.onLight}`,
  borderRadius: borderRadius.md,
  fontFamily: fontFamilies.body,
  fontSize: '14px',
  lineHeight: '20px',
  color: colors.text.highEmphasis.onLight,
  outline: 'none',
  transition: '200ms ease-out',
  boxSizing: 'border-box' as const,
};

const baseTextareaStyle: React.CSSProperties = {
  ...baseInputStyle,
  height: '100px',
  resize: 'vertical' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  color: colors.text.highEmphasis.onLight,
  marginBottom: '6px',
  fontFamily: fontFamilies.body,
};

const requiredStar: React.CSSProperties = {
  color: colors.text.important,
  marginLeft: '2px',
};

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function BrandAvatar({ initial, size = 32 }: { initial: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: borderRadius.md,
      background: colors.brand.default, color: '#FFFFFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: fontFamilies.display, fontWeight: 600,
      fontSize: size * 0.45,
    }}>
      {initial}
    </div>
  );
}

function StatusBadge({ status, isBundle }: { status: 'active' | 'archived'; isBundle?: boolean }) {
  const statusColors = {
    active: { bg: colors.badge.successLight, text: colors.badge.success },
    archived: { bg: colors.badge.charcoalLight, text: colors.badge.charcoal },
  };
  const { bg, text } = statusColors[status];
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
        borderRadius: borderRadius.full, background: bg, color: text,
        fontSize: '12px', fontWeight: 600, fontFamily: fontFamilies.body,
        lineHeight: '20px',
      }}>
        {status === 'active' ? 'Active' : 'Archived'}
      </span>
      {isBundle && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
          borderRadius: borderRadius.full, background: colors.badge.purpleLight, color: colors.badge.purple,
          fontSize: '12px', fontWeight: 600, fontFamily: fontFamilies.body,
          lineHeight: '20px',
        }}>
          Bundle
        </span>
      )}
    </div>
  );
}

function MarketBadges({ markets }: { markets: string[] }) {
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {markets.slice(0, 5).map(m => (
        <span key={m} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '4px',
          background: colors.surface.lightDarker, fontSize: '11px', fontWeight: 600,
          color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body,
        }}>
          {m}
        </span>
      ))}
      {markets.length > 5 && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '4px',
          background: colors.surface.lightDarker, fontSize: '11px', fontWeight: 500,
          color: colors.text.lowEmphasis.onLight,
        }}>
          +{markets.length - 5}
        </span>
      )}
    </div>
  );
}

function ProductThumbnail({ name, size = 48 }: { name: string; size?: number }) {
  // Generate a consistent color from product name
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const colorKeys = Object.keys(colors.avatar) as (keyof typeof colors.avatar)[];
  const bg = colors.avatar[colorKeys[hash % colorKeys.length]];
  return (
    <div style={{
      width: size, height: size, borderRadius: borderRadius.md,
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600, color: colors.text.lowEmphasis.onLight,
      fontFamily: fontFamilies.display, flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function Button({
  children, onClick, emphasis = 'high', destructive = false, size = 'md', disabled = false,
  icon, fullWidth = false,
}: {
  children: React.ReactNode; onClick?: () => void;
  emphasis?: 'high' | 'mid' | 'low'; destructive?: boolean; size?: 'md' | 'lg';
  disabled?: boolean; icon?: React.ReactNode; fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const tokens = destructive
    ? buttonTokens.destructive[emphasis === 'low' ? 'mid' : emphasis]
    : buttonTokens.emphasis[emphasis];
  const state = disabled ? tokens.disabled : hovered ? tokens.hover : tokens.enabled;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: '6px', height: buttonTokens.sizes[size].height,
        padding: `0 ${buttonTokens.sizes[size].paddingX}`,
        borderRadius: buttonTokens.borderRadius,
        background: state.background, color: state.text,
        border: state.border !== 'transparent' ? `1px solid ${state.border}` : 'none',
        fontFamily: fontFamilies.display,
        fontSize: buttonTokens.typography[size].fontSize,
        fontWeight: buttonTokens.typography[size].fontWeight,
        letterSpacing: buttonTokens.typography[size].letterSpacing,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: buttonTokens.transition,
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {icon}{children}
    </button>
  );
}

function IconButton({ children, onClick, title, active }: {
  children: React.ReactNode; onClick?: () => void; title?: string; active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: '36px', height: '36px', borderRadius: borderRadius.md,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', cursor: 'pointer', transition: '200ms ease-out',
        background: active ? colors.selected.onLight : hovered ? colors.hover.onLight : 'transparent',
        color: colors.icon.enabled.onLight,
      }}
    >
      {children}
    </button>
  );
}

// =============================================================================
// MODAL / DIALOG
// =============================================================================

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: colors.scrim,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 500,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: colors.surface.light, borderRadius: borderRadius.xl,
          padding: '32px', maxWidth: '480px', width: '90%',
          boxShadow: shadows.xl,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 800,
      background: colors.surface.dark, color: colors.text.highEmphasis.onDark,
      padding: '12px 20px', borderRadius: borderRadius.lg,
      boxShadow: shadows.lg, display: 'flex', alignItems: 'center', gap: '12px',
      fontFamily: fontFamilies.body, fontSize: '14px', fontWeight: 500,
      animation: 'slideUp 300ms ease-out',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill={colors.status.success} />
        <path d="M6 10l3 3 5-5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {message}
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', color: colors.text.lowEmphasis.onDark,
        cursor: 'pointer', padding: '4px', marginLeft: '8px',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.5 3.5l-9 9M3.5 3.5l9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// =============================================================================
// SIDEBAR
// =============================================================================

function AppSidebar({ screen, onNavigate }: {
  screen: Screen; onNavigate: (screen: Screen) => void;
}) {
  const isActive = (type: string) => screen.type === type;

  const NavItem = ({ label, icon, active, onClick }: {
    label: string; icon: string; active: boolean; onClick: () => void;
  }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: sidebarTokens.navItem.gap,
          height: sidebarTokens.navItem.height,
          padding: `0 ${sidebarTokens.navItem.paddingX}`,
          borderRadius: sidebarTokens.navItem.borderRadius,
          border: 'none', cursor: 'pointer', transition: sidebarTokens.transition,
          background: active ? sidebarTokens.colors.item.active.background : hovered ? sidebarTokens.colors.item.hover.background : 'transparent',
          color: active ? sidebarTokens.colors.item.active.text : hovered ? sidebarTokens.colors.item.hover.text : sidebarTokens.colors.item.default.text,
          fontFamily: fontFamilies.display,
          fontSize: active ? sidebarTokens.navItem.typographyActive.fontSize : sidebarTokens.navItem.typography.fontSize,
          fontWeight: active ? sidebarTokens.navItem.typographyActive.fontWeight : sidebarTokens.navItem.typography.fontWeight,
          letterSpacing: active ? sidebarTokens.navItem.typographyActive.letterSpacing : sidebarTokens.navItem.typography.letterSpacing,
          position: 'relative',
        }}
      >
        {active && (
          <div style={{
            position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '3px',
            borderRadius: '0 2px 2px 0', background: sidebarTokens.colors.item.active.indicator,
          }} />
        )}
        <span style={{ fontSize: '20px', width: '24px', textAlign: 'center' }}>{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <aside style={{
      width: sidebarTokens.width, background: sidebarTokens.colors.background,
      borderRight: `1px solid ${sidebarTokens.colors.border}`,
      display: 'flex', flexDirection: 'column',
      padding: sidebarTokens.padding.y + ' ' + sidebarTokens.padding.x,
      flexShrink: 0, height: '100%',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        height: sidebarTokens.logo.height, marginBottom: '24px',
        padding: `0 ${sidebarTokens.navItem.paddingX}`,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: borderRadius.md,
          background: colors.brand.default, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1" fill="#FFF" />
            <rect x="10" y="2" width="6" height="6" rx="1" fill="#FFF" opacity="0.6" />
            <rect x="2" y="10" width="6" height="6" rx="1" fill="#FFF" opacity="0.6" />
            <rect x="10" y="10" width="6" height="6" rx="1" fill="#FFF" opacity="0.4" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, lineHeight: '20px' }}>
            Registry
          </div>
          <div style={{ fontSize: '11px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, lineHeight: '14px' }}>
            Global Product Catalog
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <NavItem label="Home" icon="🏠" active={isActive('home')} onClick={() => onNavigate({ type: 'home' })} />
        <NavItem label="Products" icon="📦" active={isActive('catalog') || isActive('detail') || isActive('create') || isActive('edit')} onClick={() => onNavigate({ type: 'catalog' })} />
        <NavItem label="Bundles" icon="🎁" active={isActive('createBundle') || isActive('editBundle')} onClick={() => onNavigate({ type: 'catalog' })} />
        <NavItem label="Integrations" icon="🔗" active={false} onClick={() => {}} />

        <div style={{ flex: 1 }} />

        {/* Section label */}
        <div style={{
          padding: `0 ${sidebarTokens.navItem.paddingX}`,
          ...sidebarTokens.section.labelTypography,
          color: sidebarTokens.colors.sectionLabel,
          marginTop: sidebarTokens.section.marginTop,
          marginBottom: sidebarTokens.section.labelMarginBottom,
        }}>
          Settings
        </div>
        <NavItem label="API Keys" icon="🔑" active={false} onClick={() => {}} />
        <NavItem label="Team" icon="👥" active={false} onClick={() => {}} />
      </nav>
    </aside>
  );
}

// =============================================================================
// HEADER
// =============================================================================

function AppHeader({ brand, brands, onBrandChange }: {
  brand: Brand; brands: Brand[]; onBrandChange: (id: string) => void;
}) {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header style={{
      height: headerTokens.height, background: headerTokens.colors.background,
      borderBottom: `1px solid ${headerTokens.colors.border}`,
      padding: `0 ${headerTokens.padding.x}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: fontFamilies.body }}>
          Canopy
        </div>
        <div style={{ width: '1px', height: '24px', background: colors.border.lowEmphasis.onLight }} />
        <span style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
          Registry
        </span>
      </div>

      {/* Center: Search */}
      <div style={{
        width: headerTokens.search.width, height: headerTokens.search.height,
        borderRadius: headerTokens.search.borderRadius,
        background: searchFocused ? headerTokens.search.colors.backgroundFocus : headerTokens.search.colors.background,
        border: searchFocused ? `2px solid ${headerTokens.search.colors.borderFocus}` : '2px solid transparent',
        display: 'flex', alignItems: 'center', gap: headerTokens.search.gap,
        padding: `0 ${headerTokens.search.paddingX}`,
        transition: headerTokens.transition,
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke={headerTokens.search.colors.icon} strokeWidth="1.5" />
          <path d="M13.5 13.5L17 17" stroke={headerTokens.search.colors.icon} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          placeholder="Search products..."
          onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          style={{
            border: 'none', background: 'none', outline: 'none', flex: 1,
            ...headerTokens.search.typography,
            color: headerTokens.search.colors.text, fontFamily: fontFamilies.body,
          }}
        />
      </div>

      {/* Right: Brand switcher + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        {/* Brand switcher */}
        <button
          onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            height: headerTokens.orgDropdown.height,
            padding: `0 ${headerTokens.orgDropdown.paddingX}`,
            borderRadius: headerTokens.orgDropdown.borderRadius,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            background: 'transparent', cursor: 'pointer',
            transition: headerTokens.transition,
          }}
        >
          <BrandAvatar initial={brand.logoInitial} size={24} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ ...headerTokens.orgDropdown.typography.name, fontFamily: fontFamilies.body, color: colors.text.highEmphasis.onLight }}>
              {brand.name}
            </div>
            <div style={{ ...headerTokens.orgDropdown.typography.label, fontFamily: fontFamilies.body, color: colors.text.lowEmphasis.onLight }}>
              Brand
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: brandDropdownOpen ? 'rotate(180deg)' : undefined, transition: '200ms' }}>
            <path d="M4 6l4 4 4-4" stroke={colors.icon.enabled.onLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Brand dropdown */}
        {brandDropdownOpen && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
            background: colors.surface.light, borderRadius: borderRadius.lg,
            boxShadow: shadows.lg, border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            width: '280px', zIndex: 600, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: fontFamilies.body }}>
                Switch Brand
              </div>
            </div>
            {brands.map(b => (
              <button
                key={b.id}
                onClick={() => { onBrandChange(b.id); setBrandDropdownOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 16px', border: 'none', cursor: 'pointer',
                  background: b.id === brand.id ? colors.selectedHighlight : 'transparent',
                  transition: '200ms',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (b.id !== brand.id) (e.currentTarget.style.background = colors.hover.onLight); }}
                onMouseLeave={e => { (e.currentTarget.style.background = b.id === brand.id ? colors.selectedHighlight : 'transparent'); }}
              >
                <BrandAvatar initial={b.logoInitial} size={28} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    {b.productCount} products
                  </div>
                </div>
                {b.id === brand.id && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto' }}>
                    <path d="M3 8l4 4 6-6" stroke={colors.brand.default} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* User avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: borderRadius.full,
          background: colors.avatar['01'], display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.display,
          cursor: 'pointer',
        }}>
          LH
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// SCREEN: HOME / DASHBOARD
// =============================================================================

function StatIcon({ type }: { type: 'gaps' | 'total' | 'drafts' | 'active' }) {
  const iconColor = colors.text.lowEmphasis.onLight;
  const paths: Record<string, React.ReactNode> = {
    gaps: <><path d="M10 3L3 7v6l7 4 7-4V7l-7-4z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round" /><path d="M10 11v6M3 7l7 4 7-4" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round" /><circle cx="16" cy="4" r="3" fill={colors.status.warning} stroke="#FFF" strokeWidth="1" /></>,
    total: <><path d="M10 3L3 7v6l7 4 7-4V7l-7-4z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round" /><path d="M10 11v6M3 7l7 4 7-4" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round" /></>,
    drafts: <><rect x="4" y="2" width="12" height="16" rx="2" stroke={iconColor} strokeWidth="1.5" fill="none" /><path d="M7 6h6M7 10h4" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" /></>,
    active: <><circle cx="10" cy="10" r="7" stroke={iconColor} strokeWidth="1.5" fill="none" /><path d="M7 10l2 2 4-4" stroke={colors.status.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>,
  };
  return (
    <div style={{
      width: 40, height: 40, borderRadius: borderRadius.lg,
      background: colors.surface.lightDarker,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">{paths[type]}</svg>
    </div>
  );
}

function HomeScreen({ products, brand, onNavigate }: {
  products: Product[];
  brand: Brand;
  onNavigate: (screen: Screen) => void;
}) {
  // Computed stats
  const activeProducts = products.filter(p => p.status === 'active');
  const activeNonBundle = activeProducts.filter(p => !p.isBundle);
  const bundles = products.filter(p => p.isBundle);
  const gapProducts = activeProducts.filter(p => p.markets.length < 3);

  // Recently updated (top 5)
  const recentlyUpdated = [...products]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Market distribution
  const marketDistribution = products
    .filter(p => p.status === 'active')
    .reduce((acc, p) => {
      p.markets.forEach(m => { acc[m] = (acc[m] || 0) + 1; });
      return acc;
    }, {} as Record<string, number>);

  // Category breakdown
  const categoryBreakdown = products
    .filter(p => p.status === 'active')
    .reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const maxCategoryCount = Math.max(...Object.values(categoryBreakdown), 1);

  const stats = [
    { label: 'Have gaps', value: gapProducts.length, type: 'gaps' as const },
    { label: 'Total products', value: products.length, type: 'total' as const },
    { label: 'Drafts', value: 0, type: 'drafts' as const },
    { label: 'Active', value: activeProducts.length, type: 'active' as const },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1280px' }}>
      {/* Page header — matches Figma hero pattern */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ ...typography.heading.h1, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: 0 }}>
          Products
        </h1>
        <p style={{ ...typography.body.md, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, margin: '4px 0 0 0' }}>
          Your complete business overview across all integrations
        </p>
      </div>

      {/* Product stats — 4 cards matching Figma exactly */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 16px 0' }}>
          Product stats
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '20px 24px', borderRadius: borderRadius.lg,
              background: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            }}>
              <StatIcon type={stat.type} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginBottom: '2px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, lineHeight: '32px' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column dashboard body */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Left column — 2/3 */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recently Updated Products */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: 0 }}>
                Recently Updated
              </h3>
              <button
                onClick={() => onNavigate({ type: 'catalog' })}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: colors.text.action.enabled, fontSize: '13px', fontWeight: 500,
                  fontFamily: fontFamilies.body, padding: 0,
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                View all products
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div style={{
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.lg, overflow: 'hidden',
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 100px 100px',
                background: colors.surface.lightDarker, padding: '10px 20px', gap: '16px',
                borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
              }}>
                {['Product', 'Status', 'Updated'].map(h => (
                  <div key={h} style={{ fontSize: '12px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    {h}
                  </div>
                ))}
              </div>
              {/* Table rows */}
              {recentlyUpdated.map(product => (
                <div
                  key={product.id}
                  onClick={() => onNavigate({ type: 'detail', productId: product.id })}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 100px 100px',
                    padding: '12px 20px', gap: '16px', alignItems: 'center',
                    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    cursor: 'pointer', transition: '200ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = colors.hover.onLight; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ProductThumbnail name={product.name} size={36} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text.action.enabled, fontFamily: fontFamilies.body, lineHeight: '20px' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                        {product.sku}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: borderRadius.full,
                      background: product.status === 'active' ? colors.status.success : colors.text.lowEmphasis.onLight,
                    }} />
                    <span style={{ fontSize: '13px', color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body }}>
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    {product.updatedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 12px 0' }}>
              Recent Activity
            </h3>
            <div style={{
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.lg, overflow: 'hidden',
            }}>
              {RECENT_ACTIVITY.map((activity, i) => {
                const actionConfig = {
                  created: { icon: '●', color: colors.status.success, label: 'Created' },
                  updated: { icon: '●', color: colors.status.info, label: 'Updated' },
                  archived: { icon: '●', color: colors.text.lowEmphasis.onLight, label: 'Archived' },
                };
                const config = actionConfig[activity.action];
                return (
                  <div key={activity.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 20px',
                    borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none',
                  }}>
                    <span style={{ color: config.color, fontSize: '10px', lineHeight: 1 }}>{config.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, minWidth: '64px' }}>
                      {config.label}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body, flex: 1 }}>
                      {activity.productName}
                    </span>
                    <span style={{
                      width: 24, height: 24, borderRadius: borderRadius.full,
                      background: colors.avatar['01'], display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.display,
                    }}>
                      {activity.user}
                    </span>
                    <span style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                      {activity.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Market Coverage */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 12px 0' }}>
              Market Coverage
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {MARKETS.map(market => {
                const count = marketDistribution[market] || 0;
                const isCovered = count > 0;
                const isHighCoverage = count >= 5;
                return (
                  <div key={market} style={{
                    padding: '12px 8px', borderRadius: borderRadius.md, textAlign: 'center',
                    background: isCovered ? colors.selectedHighlight : colors.surface.lightDarker,
                    border: `1px solid ${isHighCoverage ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                    transition: '200ms',
                  }}>
                    <div style={{
                      fontSize: '14px', fontWeight: 600, fontFamily: fontFamilies.display,
                      color: isCovered ? colors.brand.default : colors.text.lowEmphasis.onLight,
                    }}>
                      {market}
                    </div>
                    <div style={{
                      fontSize: '11px', fontWeight: 500, fontFamily: fontFamilies.body,
                      color: isCovered ? colors.text.highEmphasis.onLight : colors.text.disabled.onLight,
                      marginTop: '2px',
                    }}>
                      {isCovered ? `${count} products` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 12px 0' }}>
              Categories
            </h3>
            <div style={{
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.lg, padding: '16px 20px',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              {CATEGORIES.map(cat => {
                const count = categoryBreakdown[cat] || 0;
                const barWidth = maxCategoryCount > 0 ? (count / maxCategoryCount) * 100 : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body }}>
                        {cat}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: count > 0 ? colors.text.highEmphasis.onLight : colors.text.disabled.onLight, fontFamily: fontFamilies.body }}>
                        {count}
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: borderRadius.full, background: colors.surface.lightDarker }}>
                      {count > 0 && (
                        <div style={{
                          height: '100%', borderRadius: borderRadius.full,
                          background: colors.brand.default,
                          width: `${barWidth}%`, transition: '300ms ease-out',
                        }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 12px 0' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button emphasis="high" fullWidth onClick={() => onNavigate({ type: 'create' })}
                icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}>
                Register new product
              </Button>
              <Button emphasis="mid" fullWidth onClick={() => onNavigate({ type: 'createBundle' })}
                icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}>
                Create bundle
              </Button>
              <Button emphasis="low" fullWidth onClick={() => onNavigate({ type: 'brandManagement' })}
                icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}>
                Manage brands
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN: PRODUCT CATALOG
// =============================================================================

function CatalogScreen({ products, onNavigate, onShowModal }: {
  products: Product[];
  onNavigate: (screen: Screen) => void;
  onShowModal: (modal: ModalState) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'single' | 'bundle'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (typeFilter === 'single' && p.isBundle) return false;
    if (typeFilter === 'bundle' && !p.isBundle) return false;
    return true;
  });

  const activeCount = products.filter(p => p.status === 'active' && !p.isBundle).length;
  const bundleCount = products.filter(p => p.isBundle).length;
  const archivedCount = products.filter(p => p.status === 'archived').length;

  return (
    <div style={{ padding: '32px', maxWidth: '1280px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ ...typography.heading.h2, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: 0 }}>
            Products
          </h1>
          <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, margin: '4px 0 0 0' }}>
            Manage your product catalog — the single source of truth for product data.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button emphasis="mid" onClick={() => onNavigate({ type: 'createBundle' })}
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}>
            Create Bundle
          </Button>
          <Button emphasis="high" onClick={() => onNavigate({ type: 'create' })}
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}>
            Create Product
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Products', value: products.length, color: colors.brand.default },
          { label: 'Active', value: activeCount, color: colors.status.success },
          { label: 'Bundles', value: bundleCount, color: colors.badge.purple },
          { label: 'Archived', value: archivedCount, color: colors.text.lowEmphasis.onLight },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, padding: '16px 20px', borderRadius: borderRadius.lg,
            background: colors.surface.lightDarker, border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: stat.color, fontFamily: fontFamilies.display, lineHeight: '32px' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="8" cy="8" r="5.5" stroke={colors.icon.enabled.onLight} strokeWidth="1.5" />
            <path d="M12 12l3.5 3.5" stroke={colors.icon.enabled.onLight} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            style={{ ...baseInputStyle, paddingLeft: '36px' }}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          style={{ ...baseInputStyle, width: '140px', cursor: 'pointer' }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>

        {/* Type filter */}
        <select
          value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
          style={{ ...baseInputStyle, width: '140px', cursor: 'pointer' }}
        >
          <option value="all">All Types</option>
          <option value="single">Single Products</option>
          <option value="bundle">Bundles</option>
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '2px', background: colors.surface.lightDarker, borderRadius: borderRadius.md, padding: '2px' }}>
          <IconButton onClick={() => setViewMode('table')} active={viewMode === 'table'} title="Table view">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </IconButton>
          <IconButton onClick={() => setViewMode('grid')} active={viewMode === 'grid'} title="Grid view">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="10.5" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="2" y="10.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </IconButton>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: '13px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginBottom: '12px' }}>
        {filtered.length} product{filtered.length !== 1 ? 's' : ''}{search && ` matching "${search}"`}
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div style={{
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.lg, overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px 120px 100px',
            background: colors.surface.lightDarker, padding: '12px 20px', gap: '16px',
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}>
            {['Product', 'Category', 'Type', 'Status', 'Markets', 'Updated'].map(h => (
              <div key={h} style={{ fontSize: '12px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                {h}
              </div>
            ))}
          </div>

          {/* Table rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body, marginBottom: '4px' }}>
                {search ? 'No products match your search' : 'No products yet'}
              </div>
              <div style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginBottom: '16px' }}>
                {search ? 'Try adjusting your filters or search terms.' : 'Create your first product to get started.'}
              </div>
              {!search && (
                <Button emphasis="high" onClick={() => onNavigate({ type: 'create' })}>Create Product</Button>
              )}
            </div>
          ) : filtered.map(product => (
            <div
              key={product.id}
              onClick={() => onNavigate({ type: 'detail', productId: product.id })}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px 120px 100px',
                padding: '14px 20px', gap: '16px', alignItems: 'center',
                borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                cursor: 'pointer', transition: '200ms',
                opacity: product.status === 'archived' ? 0.6 : 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = colors.hover.onLight; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Product name + thumbnail */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ProductThumbnail name={product.name} size={40} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body, lineHeight: '20px' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    {product.sku}
                  </div>
                </div>
              </div>
              {/* Category */}
              <div style={{ fontSize: '13px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                {product.category}
              </div>
              {/* Type */}
              <div>
                {product.isBundle ? (
                  <span style={{ padding: '2px 8px', borderRadius: borderRadius.full, background: colors.badge.purpleLight, color: colors.badge.purple, fontSize: '12px', fontWeight: 500, fontFamily: fontFamilies.body }}>
                    Bundle
                  </span>
                ) : (
                  <span style={{ fontSize: '13px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    Single
                  </span>
                )}
              </div>
              {/* Status */}
              <StatusBadge status={product.status} />
              {/* Markets */}
              <MarketBadges markets={product.markets} />
              {/* Updated */}
              <div style={{ fontSize: '13px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                {product.updatedAt}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filtered.map(product => (
            <div
              key={product.id}
              onClick={() => onNavigate({ type: 'detail', productId: product.id })}
              style={{
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.lg, cursor: 'pointer',
                transition: '200ms', overflow: 'hidden',
                opacity: product.status === 'archived' ? 0.6 : 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = shadows.md; e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight; }}
            >
              {/* Thumbnail area */}
              <div style={{ height: '140px', background: colors.surface.lightDarker, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ProductThumbnail name={product.name} size={64} />
              </div>
              <div style={{ padding: '16px' }}>
                <StatusBadge status={product.status} isBundle={product.isBundle} />
                <div style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body, marginTop: '8px', lineHeight: '22px' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginTop: '2px' }}>
                  {product.sku} &middot; {product.category}
                </div>
                {product.thcContent && (
                  <div style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginTop: '4px' }}>
                    THC: {product.thcContent} {product.cbdContent && `· CBD: ${product.cbdContent}`}
                  </div>
                )}
                <div style={{ marginTop: '12px' }}>
                  <MarketBadges markets={product.markets} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SCREEN: PRODUCT DETAIL
// =============================================================================

function DetailScreen({ product, onNavigate, onShowModal }: {
  product: Product; onNavigate: (screen: Screen) => void; onShowModal: (modal: ModalState) => void;
}) {
  const [activeTab, setActiveTab] = useState('basic');
  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'identifiers', label: 'Identifiers' },
    { id: 'specs', label: 'Specifications' },
    { id: 'markets', label: 'Markets' },
    ...(product.isBundle ? [{ id: 'components', label: 'Bundle Components' }] : []),
  ];

  const isArchived = product.status === 'archived';

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      {/* Back nav */}
      <button
        onClick={() => onNavigate({ type: 'catalog' })}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: colors.text.action.enabled, fontSize: '14px', fontWeight: 500,
          fontFamily: fontFamilies.body, padding: 0, marginBottom: '20px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Products
      </button>

      {/* Archived banner */}
      {isArchived && (
        <div style={{
          background: colors.surface.warning, border: `1px solid ${colors.surfaceBorder.warning}`,
          borderRadius: borderRadius.lg, padding: '12px 16px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '14px', color: colors.text.warning, fontFamily: fontFamilies.body, fontWeight: 500,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          This product is archived and is no longer active across connected systems.
        </div>
      )}

      {/* Product header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '28px' }}>
        <ProductThumbnail name={product.name} size={72} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: 0 }}>
              {product.name}
            </h1>
            <StatusBadge status={product.status} isBundle={product.isBundle} />
          </div>
          <p style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, margin: '4px 0 0 0' }}>
            {product.sku} &middot; {product.brand} &middot; {product.category} &middot; {product.productType}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!isArchived && (
            <>
              <Button emphasis="low" destructive onClick={() => onShowModal({
                type: 'archive', productId: product.id, productName: product.name,
                isBundle: product.isBundle, componentCount: product.components?.length,
              })}>
                Archive
              </Button>
              <Button emphasis="mid" onClick={() => onNavigate(product.isBundle ? { type: 'editBundle', productId: product.id } : { type: 'edit', productId: product.id })}>
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, marginBottom: '24px', display: 'flex', gap: '0' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px', border: 'none', cursor: 'pointer',
                background: 'transparent', fontFamily: fontFamilies.display,
                fontSize: tabTokens.typography.fontSize,
                fontWeight: tabTokens.typography.fontWeight,
                letterSpacing: tabTokens.typography.letterSpacing,
                color: isActive ? tabTokens.colors.light.active.text : tabTokens.colors.light.inactive.text,
                borderBottom: isActive ? `3px solid ${tabTokens.colors.light.active.indicator}` : '3px solid transparent',
                transition: tabTokens.transition,
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {activeTab === 'basic' && (
          <>
            <DetailField label="Name" value={product.name} />
            <DetailField label="Description" value={product.description} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <DetailField label="Category" value={product.category} />
              <DetailField label="Product Type" value={product.productType} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <DetailField label="SKU" value={product.sku} />
              <DetailField label="Status" value={product.status} />
            </div>
          </>
        )}
        {activeTab === 'identifiers' && (
          <>
            <DetailField label="Registry ID" value={product.id} />
            <DetailField label="Retail ID" value={product.retailId} />
            <DetailField label="UPC" value="—" />
            <DetailField label="Compliance Item IDs" value="3 mapped items (across 3 facilities)" />
          </>
        )}
        {activeTab === 'specs' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <DetailField label="THC Content" value={product.thcContent || '—'} />
              <DetailField label="CBD Content" value={product.cbdContent || '—'} />
            </div>
            <DetailField label="Weight" value={product.weight || '—'} />
            <DetailField label="Ingredients" value={product.ingredients || '—'} />
            <DetailField label="Allergens" value="None listed" />
          </>
        )}
        {activeTab === 'markets' && (
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body, marginBottom: '12px' }}>
              Available in {product.markets.length} market{product.markets.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.markets.map(m => (
                <div key={m} style={{
                  padding: '8px 16px', borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  background: colors.surface.lightDarker,
                  fontSize: '14px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body,
                }}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'components' && product.components && (
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body, marginBottom: '12px' }}>
              {product.components.length} component{product.components.length !== 1 ? 's' : ''} in this bundle
            </div>
            {product.components.map((comp, i) => (
              <div
                key={i}
                onClick={() => onNavigate({ type: 'detail', productId: comp.productId })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  marginBottom: '8px', cursor: 'pointer', transition: '200ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = colors.hover.onLight; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ProductThumbnail name={comp.productName} size={36} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    {comp.productName}
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: borderRadius.full,
                  background: colors.surface.lightDarker, fontSize: '13px', fontWeight: 600,
                  color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body,
                }}>
                  x{comp.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity placeholder */}
      <div style={{
        marginTop: '40px', padding: '24px', borderRadius: borderRadius.lg,
        background: colors.surface.lightDarker, border: `1px dashed ${colors.border.midEmphasis.onLight}`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
          Activity log will appear here in Phase 2
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body, lineHeight: '22px' }}>
        {value}
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN: PRODUCT CREATE / EDIT
// =============================================================================

function ProductFormScreen({ product, isEdit, isBundle, onNavigate, onShowModal, allProducts }: {
  product?: Product; isEdit: boolean; isBundle: boolean;
  onNavigate: (screen: Screen) => void; onShowModal: (modal: ModalState) => void;
  allProducts: Product[];
}) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || '');
  const [productType, setProductType] = useState(product?.productType || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [thcContent, setThcContent] = useState(product?.thcContent || '');
  const [cbdContent, setCbdContent] = useState(product?.cbdContent || '');
  const [weight, setWeight] = useState(product?.weight || '');
  const [ingredients, setIngredients] = useState(product?.ingredients || '');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(product?.markets || []);
  const [components, setComponents] = useState<{ productId: string; productName: string; quantity: number }[]>(product?.components || []);
  const [componentSearch, setComponentSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!category) newErrors.category = 'Category is required';
    if (!productType) newErrors.productType = 'Product type is required';
    if (isBundle && components.length === 0) newErrors.components = 'At least one component is required for a bundle';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isBundle) {
      onShowModal({ type: 'confirmBundle', productName: name });
    } else if (isEdit) {
      onShowModal({ type: 'confirmEdit', productName: name });
    } else {
      onShowModal({ type: 'confirmCreate', productName: name });
    }
  };

  const availableComponents = allProducts.filter(p =>
    !p.isBundle && p.status === 'active' &&
    !components.some(c => c.productId === p.id) &&
    (componentSearch ? p.name.toLowerCase().includes(componentSearch.toLowerCase()) : true)
  );

  const title = isEdit
    ? `Edit ${isBundle ? 'Bundle' : 'Product'}`
    : `Create ${isBundle ? 'Bundle' : 'Product'}`;

  return (
    <div style={{ padding: '32px', maxWidth: '720px' }}>
      {/* Back nav */}
      <button
        onClick={() => onNavigate(isEdit && product ? { type: 'detail', productId: product.id } : { type: 'catalog' })}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: colors.text.action.enabled, fontSize: '14px', fontWeight: 500,
          fontFamily: fontFamilies.body, padding: 0, marginBottom: '20px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {isEdit ? 'Back to Product' : 'Back to Products'}
      </button>

      <h1 style={{ ...typography.heading.h2, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 8px 0' }}>
        {title}
      </h1>
      <p style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, margin: '0 0 32px 0' }}>
        {isEdit ? 'Changes will propagate to all connected systems.' : 'This product will be added to the global registry as a source of truth.'}
      </p>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div style={{
          background: colors.surface.important, border: `1px solid ${colors.surfaceBorder.important}`,
          borderRadius: borderRadius.lg, padding: '12px 16px', marginBottom: '24px',
          fontSize: '14px', color: colors.text.important, fontFamily: fontFamilies.body,
        }}>
          Please fix {Object.keys(errors).length} error{Object.keys(errors).length !== 1 ? 's' : ''} below.
        </div>
      )}

      {/* SECTION: Basic Info */}
      <FormSection title="Basic Information">
        <FormField label="Product Name" required error={errors.name}>
          <input value={name} onChange={e => { setName(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.name; return n; }); }}
            placeholder="e.g., Wyld Raspberry Gummies" style={{ ...baseInputStyle, borderColor: errors.name ? colors.status.important : undefined }} />
        </FormField>
        <FormField label="Description">
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Describe this product..." style={baseTextareaStyle} />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Category" required error={errors.category}>
            <select value={category} onChange={e => { setCategory(e.target.value); setProductType(''); setErrors(prev => { const n = { ...prev }; delete n.category; return n; }); }}
              style={{ ...baseInputStyle, cursor: 'pointer', borderColor: errors.category ? colors.status.important : undefined }}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Product Type" required error={errors.productType}>
            <select value={productType} onChange={e => { setProductType(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.productType; return n; }); }}
              disabled={!category}
              style={{ ...baseInputStyle, cursor: category ? 'pointer' : 'not-allowed', borderColor: errors.productType ? colors.status.important : undefined, opacity: category ? 1 : 0.5 }}>
              <option value="">Select type...</option>
              {(PRODUCT_TYPES[category] || []).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
        </div>
        <FormField label="SKU">
          <input value={sku} onChange={e => setSku(e.target.value)}
            placeholder="e.g., WYL-RSP-100" style={baseInputStyle} />
        </FormField>
      </FormSection>

      {/* SECTION: Specifications */}
      <FormSection title="Specifications">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="THC Content">
            <input value={thcContent} onChange={e => setThcContent(e.target.value)} placeholder="e.g., 100mg" style={baseInputStyle} />
          </FormField>
          <FormField label="CBD Content">
            <input value={cbdContent} onChange={e => setCbdContent(e.target.value)} placeholder="e.g., 0mg" style={baseInputStyle} />
          </FormField>
        </div>
        <FormField label="Weight">
          <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g., 85g" style={baseInputStyle} />
        </FormField>
        <FormField label="Ingredients">
          <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="List ingredients..." style={baseTextareaStyle} />
        </FormField>
      </FormSection>

      {/* SECTION: Markets */}
      <FormSection title="Market Availability">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {MARKETS.map(m => {
            const selected = selectedMarkets.includes(m);
            return (
              <button
                key={m}
                onClick={() => setSelectedMarkets(prev => selected ? prev.filter(x => x !== m) : [...prev, m])}
                style={{
                  padding: '6px 14px', borderRadius: borderRadius.md,
                  border: `1.5px solid ${selected ? colors.brand.default : colors.border.midEmphasis.onLight}`,
                  background: selected ? colors.selectedHighlight : 'transparent',
                  color: selected ? colors.brand.default : colors.text.highEmphasis.onLight,
                  fontSize: '13px', fontWeight: selected ? 600 : 400, fontFamily: fontFamilies.body,
                  cursor: 'pointer', transition: '200ms',
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </FormSection>

      {/* SECTION: Bundle Components (only for bundles) */}
      {isBundle && (
        <FormSection title="Bundle Components">
          {errors.components && (
            <div style={{ fontSize: '13px', color: colors.text.important, fontFamily: fontFamilies.body, marginBottom: '8px' }}>
              {errors.components}
            </div>
          )}

          {/* Existing components */}
          {components.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {components.map((comp, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`, background: colors.surface.lightDarker,
                }}>
                  <ProductThumbnail name={comp.productName} size={32} />
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    {comp.productName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => setComponents(prev => prev.map((c, j) => j === i ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c))}
                      style={{ width: '28px', height: '28px', borderRadius: borderRadius.sm, border: `1px solid ${colors.border.midEmphasis.onLight}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      -
                    </button>
                    <span style={{ width: '28px', textAlign: 'center', fontSize: '14px', fontWeight: 600, fontFamily: fontFamilies.body }}>
                      {comp.quantity}
                    </span>
                    <button onClick={() => setComponents(prev => prev.map((c, j) => j === i ? { ...c, quantity: c.quantity + 1 } : c))}
                      style={{ width: '28px', height: '28px', borderRadius: borderRadius.sm, border: `1px solid ${colors.border.midEmphasis.onLight}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      +
                    </button>
                  </div>
                  <button onClick={() => setComponents(prev => prev.filter((_, j) => j !== i))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.important, padding: '4px', fontSize: '18px' }}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add component search */}
          <div style={{ position: 'relative' }}>
            <input
              value={componentSearch} onChange={e => setComponentSearch(e.target.value)}
              placeholder="Search products to add as components..."
              style={baseInputStyle}
            />
            {componentSearch && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                background: colors.surface.light, borderRadius: borderRadius.md,
                boxShadow: shadows.lg, border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                maxHeight: '200px', overflowY: 'auto', zIndex: 100,
              }}>
                {availableComponents.length === 0 ? (
                  <div style={{ padding: '12px 16px', fontSize: '13px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>
                    No matching products found
                  </div>
                ) : availableComponents.slice(0, 5).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setComponents(prev => [...prev, { productId: p.id, productName: p.name, quantity: 1 }]);
                      setComponentSearch('');
                      setErrors(prev => { const n = { ...prev }; delete n.components; return n; });
                    }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 16px', border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left', transition: '200ms',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = colors.hover.onLight; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <ProductThumbnail name={p.name} size={28} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body }}>{p.sku}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormSection>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
        <Button emphasis="low" onClick={() => onNavigate(isEdit && product ? { type: 'detail', productId: product.id } : { type: 'catalog' })}>
          Cancel
        </Button>
        <Button emphasis="high" onClick={handleSubmit}>
          {isEdit ? 'Save Changes' : (isBundle ? 'Create Bundle' : 'Create Product')}
        </Button>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ ...typography.heading.h5, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 16px 0' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStar}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: '12px', color: colors.text.important, fontFamily: fontFamilies.body, marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SCREEN: BRAND MANAGEMENT
// =============================================================================

function BrandManagementScreen({ brands, activeBrand }: { brands: Brand[]; activeBrand: Brand }) {
  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <h1 style={{ ...typography.heading.h2, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 8px 0' }}>
        Brand Management
      </h1>
      <p style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, margin: '0 0 32px 0' }}>
        Manage brand information and settings.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {brands.map(brand => (
          <div key={brand.id} style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '20px', borderRadius: borderRadius.lg,
            border: `1px solid ${brand.id === activeBrand.id ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
            background: brand.id === activeBrand.id ? colors.selectedHighlight : 'transparent',
          }}>
            <BrandAvatar initial={brand.logoInitial} size={48} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.body }}>
                  {brand.name}
                </span>
                {brand.id === activeBrand.id && (
                  <span style={{ padding: '2px 8px', borderRadius: borderRadius.full, background: colors.badge.successLight, color: colors.badge.success, fontSize: '11px', fontWeight: 600, fontFamily: fontFamilies.body }}>
                    Active
                  </span>
                )}
              </div>
              <div style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginTop: '2px' }}>
                {brand.description}
              </div>
              <div style={{ fontSize: '13px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, marginTop: '4px' }}>
                {brand.productCount} products
              </div>
            </div>
            <Button emphasis="low" size="md">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN APP (ORCHESTRATOR)
// =============================================================================

export function RegistryApp() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' });
  const [modal, setModal] = useState<ModalState>(null);
  const [activeBrandId, setActiveBrandId] = useState('b1');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const activeBrand = BRANDS.find(b => b.id === activeBrandId) || BRANDS[0];
  const brandProducts = products; // In a real app, filter by brand

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    setModal(null);
  }, []);

  const showModal = useCallback((m: ModalState) => {
    setModal(m);
  }, []);

  const dismissModal = useCallback(() => setModal(null), []);

  const handleConfirmAction = useCallback(() => {
    if (!modal) return;
    if (modal.type === 'archive') {
      setProducts(prev => prev.map(p => p.id === modal.productId ? { ...p, status: 'archived' as const } : p));
      setModal({ type: 'successToast', message: `${modal.productName} has been archived.` });
      setScreen({ type: 'catalog' });
    } else if (modal.type === 'confirmCreate' || modal.type === 'confirmBundle') {
      setModal({ type: 'successToast', message: `${modal.productName} has been created.` });
      setScreen({ type: 'catalog' });
    } else if (modal.type === 'confirmEdit') {
      setModal({ type: 'successToast', message: `${modal.productName} has been updated.` });
      setScreen({ type: 'catalog' });
    }
    // Auto-dismiss toast
    setTimeout(() => setModal(null), 3000);
  }, [modal]);

  const currentProduct = (() => {
    if ('productId' in screen) {
      return products.find(p => p.id === (screen as { productId: string }).productId);
    }
    return undefined;
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: colors.surface.light, fontFamily: fontFamilies.body }}>
      <AppHeader brand={activeBrand} brands={BRANDS} onBrandChange={setActiveBrandId} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AppSidebar screen={screen} onNavigate={navigate} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {screen.type === 'home' && (
            <HomeScreen products={brandProducts} brand={activeBrand} onNavigate={navigate} />
          )}
          {screen.type === 'catalog' && (
            <CatalogScreen products={brandProducts} onNavigate={navigate} onShowModal={showModal} />
          )}
          {screen.type === 'detail' && currentProduct && (
            <DetailScreen product={currentProduct} onNavigate={navigate} onShowModal={showModal} />
          )}
          {screen.type === 'create' && (
            <ProductFormScreen isEdit={false} isBundle={false} onNavigate={navigate} onShowModal={showModal} allProducts={products} />
          )}
          {screen.type === 'createBundle' && (
            <ProductFormScreen isEdit={false} isBundle={true} onNavigate={navigate} onShowModal={showModal} allProducts={products} />
          )}
          {screen.type === 'edit' && currentProduct && (
            <ProductFormScreen product={currentProduct} isEdit={true} isBundle={false} onNavigate={navigate} onShowModal={showModal} allProducts={products} />
          )}
          {screen.type === 'editBundle' && currentProduct && (
            <ProductFormScreen product={currentProduct} isEdit={true} isBundle={true} onNavigate={navigate} onShowModal={showModal} allProducts={products} />
          )}
          {screen.type === 'brandManagement' && (
            <BrandManagementScreen brands={BRANDS} activeBrand={activeBrand} />
          )}
        </main>
      </div>

      {/* MODALS */}
      {modal?.type === 'archive' && (
        <Modal onClose={dismissModal}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: borderRadius.full, background: colors.surface.important, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M4.93 19h14.14c1.34 0 2.18-1.45 1.52-2.62L13.52 4.38c-.66-1.17-2.38-1.17-3.04 0L3.41 16.38C2.75 17.55 3.59 19 4.93 19z" stroke={colors.status.important} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 8px 0' }}>
              Archive {modal.productName}?
            </h3>
            <p style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, margin: '0 0 8px 0', lineHeight: '22px' }}>
              Archiving this product will mark it as <strong>inactive across all connected systems</strong>, including Retail ID and third-party integrations.
            </p>
            {modal.isBundle && modal.componentCount && (
              <p style={{ fontSize: '14px', color: colors.text.warning, fontFamily: fontFamilies.body, margin: '0 0 20px 0', fontWeight: 500 }}>
                This bundle contains {modal.componentCount} component products. The component products will <strong>not</strong> be archived.
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <Button emphasis="low" onClick={dismissModal}>Cancel</Button>
              <Button emphasis="high" destructive onClick={handleConfirmAction}>Archive Product</Button>
            </div>
          </div>
        </Modal>
      )}

      {(modal?.type === 'confirmCreate' || modal?.type === 'confirmEdit' || modal?.type === 'confirmBundle') && (
        <Modal onClose={dismissModal}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: borderRadius.full, background: colors.surface.info, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke={colors.status.info} strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke={colors.status.info} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, fontFamily: fontFamilies.display, margin: '0 0 8px 0' }}>
              {modal.type === 'confirmCreate' ? 'Create Product?' : modal.type === 'confirmBundle' ? 'Create Bundle?' : 'Save Changes?'}
            </h3>
            <p style={{ fontSize: '14px', color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.body, margin: '0 0 20px 0', lineHeight: '22px' }}>
              {modal.type === 'confirmEdit'
                ? `Updating "${modal.productName}" will affect all connected systems using this data, including Retail ID and third-party integrations.`
                : `Creating "${modal.productName}" will make it available as a source of truth across connected systems.`}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button emphasis="low" onClick={dismissModal}>Cancel</Button>
              <Button emphasis="high" onClick={handleConfirmAction}>
                {modal.type === 'confirmEdit' ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'successToast' && (
        <Toast message={modal.message} onDismiss={dismissModal} />
      )}

      {/* Global animation styles */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default RegistryApp;
