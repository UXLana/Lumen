'use client';

import { useState } from 'react';
import {
  colors,
  typography,
  fontFamilies,
  spacing,
  shadows,
  borderRadius,
} from '@/styles/design-tokens';
import { useThemeSwitcher, availableThemes } from '@/styles/themes/theme-provider';

// =============================================================================
// SAMPLE DATA
// =============================================================================

const BRANDS = [
  { id: 'b1', name: 'Wyld', products: 156, completeness: 94, atRisk: 3, markets: ['CA', 'CO', 'OR', 'NV', 'AZ', 'MI'] },
  { id: 'b2', name: 'Holistic Industries', products: 210, completeness: 87, atRisk: 12, markets: ['CA', 'CO', 'MI', 'MA', 'PA', 'MD', 'OH'] },
  { id: 'b3', name: 'Autumn Brands', products: 48, completeness: 72, atRisk: 8, markets: ['CA', 'OR'] },
  { id: 'b4', name: 'Green Thumb', products: 189, completeness: 91, atRisk: 5, markets: ['CA', 'CO', 'NV', 'IL', 'PA'] },
  { id: 'b5', name: 'Cresco Labs', products: 122, completeness: 68, atRisk: 18, markets: ['IL', 'PA', 'OH', 'MI'] },
];

const MARKETS = [
  { state: 'CA', name: 'California', products: 320, compliant: 92 },
  { state: 'CO', name: 'Colorado', products: 245, compliant: 96 },
  { state: 'MI', name: 'Michigan', products: 178, compliant: 78 },
  { state: 'OR', name: 'Oregon', products: 142, compliant: 94 },
  { state: 'NV', name: 'Nevada', products: 118, compliant: 88 },
  { state: 'PA', name: 'Pennsylvania', products: 95, compliant: 82 },
  { state: 'IL', name: 'Illinois', products: 87, compliant: 85 },
  { state: 'OH', name: 'Ohio', products: 64, compliant: 71 },
  { state: 'AZ', name: 'Arizona', products: 52, compliant: 90 },
  { state: 'MA', name: 'Massachusetts', products: 41, compliant: 76 },
  { state: 'MD', name: 'Maryland', products: 38, compliant: 83 },
];

const CATEGORIES = [
  { name: 'Flower', count: 285, pct: 26 },
  { name: 'Edibles', count: 248, pct: 23 },
  { name: 'Vape', count: 198, pct: 18 },
  { name: 'Concentrates', count: 143, pct: 13 },
  { name: 'Pre-rolls', count: 110, pct: 10 },
  { name: 'Topicals', count: 65, pct: 6 },
  { name: 'Tinctures', count: 43, pct: 4 },
];

const URGENT_TASKS = [
  { id: 't1', type: 'compliance', description: '15 products in CA need updated THC warnings', brand: 'Holistic Industries', market: 'CA', severity: 'critical' as const, dueDate: '2026-03-01', productCount: 15 },
  { id: 't2', type: 'missing-data', description: '8 products missing required market fields', brand: 'Cresco Labs', market: 'OH', severity: 'critical' as const, dueDate: '2026-02-28', productCount: 8 },
  { id: 't3', type: 'migration', description: 'Migration conflicts from Retail ID import', brand: 'Autumn Brands', market: 'CA', severity: 'warning' as const, dueDate: '2026-03-15', productCount: 4 },
  { id: 't4', type: 'compliance', description: '22 products need updated packaging disclosures', brand: 'Green Thumb', market: 'IL', severity: 'warning' as const, dueDate: '2026-03-20', productCount: 22 },
  { id: 't5', type: 'missing-data', description: '6 products missing images for go-live', brand: 'Wyld', market: 'MI', severity: 'info' as const, dueDate: '2026-04-01', productCount: 6 },
];

const RECENT_ACTIVITY = [
  { product: 'Wyld Raspberry Gummies', action: 'updated' as const, brand: 'Wyld', market: 'CA', user: 'Sarah Chen', timestamp: '2 hours ago' },
  { product: 'Holistic CBD Tincture 1000mg', action: 'created' as const, brand: 'Holistic Industries', market: 'MI', user: 'James Rodriguez', timestamp: '4 hours ago' },
  { product: 'Autumn OG Pre-roll 6pk', action: 'archived' as const, brand: 'Autumn Brands', market: 'CA', user: 'Maria Lopez', timestamp: '5 hours ago' },
  { product: 'Green Thumb Sativa Vape', action: 'updated' as const, brand: 'Green Thumb', market: 'CO', user: 'Alex Kim', timestamp: '6 hours ago' },
  { product: 'Cresco GG#4 Live Resin', action: 'created' as const, brand: 'Cresco Labs', market: 'IL', user: 'David Park', timestamp: '8 hours ago' },
  { product: 'Wyld Elderberry Gummies', action: 'updated' as const, brand: 'Wyld', market: 'OR', user: 'Sarah Chen', timestamp: '1 day ago' },
  { product: 'Holistic Indica Flower 3.5g', action: 'updated' as const, brand: 'Holistic Industries', market: 'PA', user: 'James Rodriguez', timestamp: '1 day ago' },
  { product: 'Green Thumb Hybrid Cartridge', action: 'created' as const, brand: 'Green Thumb', market: 'NV', user: 'Emily Tran', timestamp: '2 days ago' },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function StatusBadge({ status }: { status: 'success' | 'warning' | 'critical' | 'info' }) {
  const config = {
    success: { bg: colors.surface.success, border: colors.surfaceBorder.success, text: colors.text.success, label: 'Good' },
    warning: { bg: colors.surface.warning, border: colors.surfaceBorder.warning, text: colors.text.warning, label: 'At Risk' },
    critical: { bg: colors.surface.important, border: colors.surfaceBorder.important, text: colors.text.important, label: 'Critical' },
    info: { bg: colors.surface.info, border: colors.surfaceBorder.info, text: colors.status.info, label: 'Info' },
  }[status];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 10px',
      borderRadius: borderRadius.full,
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: fontFamilies.body,
      backgroundColor: config.bg,
      color: config.text,
      border: `1px solid ${config.border}`,
      lineHeight: '18px',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        backgroundColor: config.text,
      }} />
      {config.label}
    </span>
  );
}

function ProgressBar({ value, size = 'md', color }: { value: number; size?: 'sm' | 'md'; color?: string }) {
  const height = size === 'sm' ? 6 : 8;
  const barColor = color || (value >= 90 ? colors.status.success : value >= 70 ? colors.status.warning : colors.status.important);
  return (
    <div style={{
      width: '100%',
      height,
      borderRadius: borderRadius.full,
      backgroundColor: colors.progressIndicatorTrack,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${Math.min(value, 100)}%`,
        height: '100%',
        borderRadius: borderRadius.full,
        backgroundColor: barColor,
        transition: 'width 0.6s ease',
      }} />
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing[4],
    }}>
      <div>
        <h2 style={{
          ...typography.heading.h4,
          color: colors.text.highEmphasis.onLight,
          margin: 0,
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            ...typography.body.sm,
            color: colors.text.lowEmphasis.onLight,
            margin: '2px 0 0 0',
          }}>{subtitle}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            ...typography.label.sm,
            color: colors.text.action.enabled,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: borderRadius.sm,
          }}
        >
          {action.label} &rarr;
        </button>
      )}
    </div>
  );
}

function MetricCard({ label, value, subtitle, trend, icon }: {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon: string;
}) {
  return (
    <div style={{
      backgroundColor: colors.surface.light,
      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      borderRadius: borderRadius.lg,
      padding: `${spacing[4]} ${spacing[5]}`,
      display: 'flex',
      gap: spacing[3],
      alignItems: 'center',
      flex: 1,
      minWidth: 180,
    }}>
      {/* Icon circle — matches Figma stat card pattern */}
      <div style={{
        width: 48, height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface.lightDarker,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          ...typography.body.sm,
          color: colors.text.lowEmphasis.onLight,
          marginBottom: 2,
        }}>{label}</div>
        <div style={{
          fontFamily: fontFamilies.display,
          fontSize: '28px',
          fontWeight: 600,
          lineHeight: '34px',
          color: colors.text.highEmphasis.onLight,
        }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {(subtitle || trend) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            {subtitle && (
              <span style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
                {subtitle}
              </span>
            )}
            {trend && (
              <span style={{
                ...typography.label.sm,
                color: trend.positive ? colors.text.success : colors.text.important,
              }}>
                {trend.positive ? '\u2191' : '\u2193'} {trend.value}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Donut chart component for completeness
function DonutChart({ value, size = 100, strokeWidth = 10, label }: { value: number; size?: number; strokeWidth?: number; label: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 90 ? colors.status.success : value >= 70 ? colors.status.warning : colors.status.important;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={colors.progressIndicatorTrack}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fontFamilies.display,
          fontSize: size > 80 ? '22px' : '16px',
          fontWeight: 600,
          color: colors.text.highEmphasis.onLight,
        }}>
          {value}%
        </div>
      </div>
      <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}

// Horizontal bar for category / brand breakdowns
function HorizontalBar({ label, value, maxValue, color, suffix }: {
  label: string; value: number; maxValue: number; color: string; suffix?: string;
}) {
  const pct = (value / maxValue) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <span style={{
        ...typography.body.sm,
        color: colors.text.highEmphasis.onLight,
        width: 120,
        flexShrink: 0,
        textAlign: 'right',
      }}>{label}</span>
      <div style={{
        flex: 1, height: 20, borderRadius: borderRadius.sm,
        backgroundColor: colors.progressIndicatorTrack,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          backgroundColor: color,
          borderRadius: borderRadius.sm,
          transition: 'width 0.5s ease',
          minWidth: 2,
        }} />
      </div>
      <span style={{
        ...typography.label.sm,
        color: colors.text.highEmphasis.onLight,
        width: 60,
        textAlign: 'right',
        flexShrink: 0,
      }}>
        {value.toLocaleString()}{suffix || ''}
      </span>
    </div>
  );
}

// =============================================================================
// SECTION COMPONENTS
// =============================================================================

function CatalogOverview() {
  const [breakdownTab, setBreakdownTab] = useState<'brand' | 'market' | 'category'>('brand');
  const totalProducts = 725;
  const activeProducts = 683;
  const archivedProducts = 42;
  const singleProducts = 612;
  const bundleProducts = 113;
  const maxBrandProducts = Math.max(...BRANDS.map(b => b.products));
  const maxMarketProducts = Math.max(...MARKETS.map(m => m.products));
  const maxCategoryCount = Math.max(...CATEGORIES.map(c => c.count));

  const dataVizColors = [
    colors.dataViz['04'], colors.dataViz['06'], colors.dataViz['08'],
    colors.dataViz['10'], colors.dataViz['12'], colors.dataViz['02'],
    colors.dataViz['14'],
  ];

  return (
    <section>
      <SectionHeader title="Catalog Overview" subtitle="Across all brands and markets" />

      {/* Hero metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing[4],
        marginBottom: spacing[6],
      }}>
        <MetricCard icon={'\uD83D\uDCE6'} label="Total Products" value={totalProducts}
          subtitle={`${activeProducts} active \u00B7 ${archivedProducts} archived`}
          trend={{ value: '+12 this week', positive: true }} />
        <MetricCard icon={'\uD83C\uDFE2'} label="Active Brands" value={5} subtitle="Managing catalog" />
        <MetricCard icon={'\uD83D\uDDFA\uFE0F'} label="Active Markets" value={11} subtitle="States with products" />
        <MetricCard icon={'\uD83D\uDCCA'} label="Bundles" value={bundleProducts}
          subtitle={`${Math.round((bundleProducts / totalProducts) * 100)}% of catalog`} />
      </div>

      {/* Breakdown tabs */}
      <div style={{
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
      }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
        }}>
          {(['brand', 'market', 'category'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setBreakdownTab(tab)}
              style={{
                ...typography.label.md,
                padding: `${spacing[3]} ${spacing[5]}`,
                border: 'none',
                background: breakdownTab === tab ? colors.surface.light : 'transparent',
                color: breakdownTab === tab ? colors.brand.default : colors.text.lowEmphasis.onLight,
                cursor: 'pointer',
                borderBottom: breakdownTab === tab ? `2px solid ${colors.brand.default}` : '2px solid transparent',
                marginBottom: -1,
                textTransform: 'capitalize',
              }}
            >
              By {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: spacing[5] }}>
          {breakdownTab === 'brand' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BRANDS.map((b, i) => (
                <HorizontalBar
                  key={b.id}
                  label={b.name}
                  value={b.products}
                  maxValue={maxBrandProducts}
                  color={dataVizColors[i % dataVizColors.length]}
                />
              ))}
            </div>
          )}
          {breakdownTab === 'market' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MARKETS.map((m, i) => (
                <HorizontalBar
                  key={m.state}
                  label={`${m.state} \u2014 ${m.name}`}
                  value={m.products}
                  maxValue={maxMarketProducts}
                  color={dataVizColors[i % dataVizColors.length]}
                />
              ))}
            </div>
          )}
          {breakdownTab === 'category' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CATEGORIES.map((c, i) => (
                <HorizontalBar
                  key={c.name}
                  label={c.name}
                  value={c.count}
                  maxValue={maxCategoryCount}
                  color={dataVizColors[i % dataVizColors.length]}
                  suffix={` (${c.pct}%)`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DataQualitySection() {
  const overallGlobal = 86;
  const overallMarket = 79;

  return (
    <section>
      <SectionHeader
        title="Data Quality & Compliance"
        subtitle="Completeness and risk indicators"
        action={{ label: 'View all issues', onClick: () => {} }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: spacing[4],
      }}>
        {/* Left: Donut charts */}
        <div style={{
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.lg,
          padding: spacing[5],
          display: 'flex',
          justifyContent: 'center',
          gap: spacing[8],
          alignItems: 'center',
        }}>
          <DonutChart value={overallGlobal} label="Global Fields" />
          <DonutChart value={overallMarket} label="Market Fields" />
        </div>

        {/* Right: Alert cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          {/* Missing data indicators */}
          <div style={{
            backgroundColor: colors.surface.important,
            border: `1px solid ${colors.surfaceBorder.important}`,
            borderRadius: borderRadius.md,
            padding: `${spacing[3]} ${spacing[4]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{'\u26A0\uFE0F'}</span>
              <div>
                <div style={{ ...typography.label.md, color: colors.text.important }}>
                  32 products missing required global fields
                </div>
                <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
                  Name, SKU, or description not populated
                </div>
              </div>
            </div>
            <span style={{ ...typography.label.sm, color: colors.text.action.enabled }}>Fix &rarr;</span>
          </div>

          <div style={{
            backgroundColor: colors.surface.warning,
            border: `1px solid ${colors.surfaceBorder.warning}`,
            borderRadius: borderRadius.md,
            padding: `${spacing[3]} ${spacing[4]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{'\uD83D\uDCCB'}</span>
              <div>
                <div style={{ ...typography.label.md, color: colors.text.warning }}>
                  47 products missing market-specific fields
                </div>
                <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
                  THC/CBD ranges, warnings, or jurisdiction statements
                </div>
              </div>
            </div>
            <span style={{ ...typography.label.sm, color: colors.text.action.enabled }}>Fix &rarr;</span>
          </div>

          <div style={{
            backgroundColor: colors.surface.info,
            border: `1px solid ${colors.surfaceBorder.info}`,
            borderRadius: borderRadius.md,
            padding: `${spacing[3]} ${spacing[4]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{'\uD83D\uDDBC\uFE0F'}</span>
              <div>
                <div style={{ ...typography.label.md, color: colors.status.info }}>
                  18 products missing images or labels
                </div>
                <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
                  Required for go-live in target markets
                </div>
              </div>
            </div>
            <span style={{ ...typography.label.sm, color: colors.text.action.enabled }}>Fix &rarr;</span>
          </div>

          <div style={{ display: 'flex', gap: spacing[3] }}>
            <div style={{
              flex: 1,
              backgroundColor: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.md,
              padding: `${spacing[3]} ${spacing[4]}`,
              cursor: 'pointer',
            }}>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Suspected Duplicates</div>
              <div style={{
                fontFamily: fontFamilies.display, fontSize: '24px', fontWeight: 600,
                color: colors.text.warning,
              }}>12</div>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.md,
              padding: `${spacing[3]} ${spacing[4]}`,
              cursor: 'pointer',
            }}>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>SKU Conflicts</div>
              <div style={{
                fontFamily: fontFamilies.display, fontSize: '24px', fontWeight: 600,
                color: colors.text.important,
              }}>5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-brand completeness */}
      <div style={{
        marginTop: spacing[4],
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: fontFamilies.body,
        }}>
          <thead>
            <tr style={{ backgroundColor: colors.surface.lightDarker }}>
              <th style={{ ...thStyle, textAlign: 'left' }}>Brand</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Completeness</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 100 }}>At Risk</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 100 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {BRANDS.map(b => (
              <tr key={b.id} style={{ borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{b.name}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ProgressBar value={b.completeness} size="sm" />
                    <span style={{ ...typography.label.sm, width: 36, textAlign: 'right' }}>{b.completeness}%</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{b.atRisk}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <StatusBadge status={b.completeness >= 90 ? 'success' : b.completeness >= 70 ? 'warning' : 'critical'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MigrationSection() {
  return (
    <section>
      <SectionHeader
        title="Migration Status"
        subtitle="Data migration from existing systems"
        action={{ label: 'Review all issues', onClick: () => {} }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing[4],
      }}>
        {/* Metrc Compliance migration */}
        <div style={{
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.lg,
          padding: spacing[5],
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing[3],
          }}>
            <span style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight }}>
              From Metrc Compliance
            </span>
            <span style={{
              fontFamily: fontFamilies.display, fontSize: '20px', fontWeight: 600,
              color: colors.text.highEmphasis.onLight,
            }}>82%</span>
          </div>
          <ProgressBar value={82} color={colors.dataViz['04']} />
          <div style={{
            display: 'flex',
            gap: spacing[4],
            marginTop: spacing[3],
          }}>
            <div>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Migrated</div>
              <div style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight }}>594 / 725</div>
            </div>
            <div>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>With Issues</div>
              <div style={{ ...typography.label.md, color: colors.text.warning }}>23</div>
            </div>
            <div>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Failed</div>
              <div style={{ ...typography.label.md, color: colors.text.important }}>8</div>
            </div>
          </div>
        </div>

        {/* Retail ID migration */}
        <div style={{
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.lg,
          padding: spacing[5],
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing[3],
          }}>
            <span style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight }}>
              From Retail ID
            </span>
            <span style={{
              fontFamily: fontFamilies.display, fontSize: '20px', fontWeight: 600,
              color: colors.text.highEmphasis.onLight,
            }}>65%</span>
          </div>
          <ProgressBar value={65} color={colors.dataViz['06']} />
          <div style={{
            display: 'flex',
            gap: spacing[4],
            marginTop: spacing[3],
          }}>
            <div>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Migrated</div>
              <div style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight }}>471 / 725</div>
            </div>
            <div>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>With Issues</div>
              <div style={{ ...typography.label.md, color: colors.text.warning }}>45</div>
            </div>
            <div>
              <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Failed</div>
              <div style={{ ...typography.label.md, color: colors.text.important }}>14</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lineage summary */}
      <div style={{
        marginTop: spacing[4],
        display: 'flex',
        gap: spacing[4],
      }}>
        <div style={{
          flex: 1,
          backgroundColor: colors.surface.success,
          border: `1px solid ${colors.surfaceBorder.success}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[3]} ${spacing[4]}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
        }}>
          <span style={{ fontSize: 20 }}>{'\u2705'}</span>
          <div>
            <div style={{ ...typography.label.md, color: colors.text.success }}>
              518 products feeding Retail ID
            </div>
            <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
              71% of catalog connected to downstream
            </div>
          </div>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: colors.surface.warning,
          border: `1px solid ${colors.surfaceBorder.warning}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[3]} ${spacing[4]}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
        }}>
          <span style={{ fontSize: 20 }}>{'\uD83D\uDD17'}</span>
          <div>
            <div style={{ ...typography.label.md, color: colors.text.warning }}>
              207 Registry-only products
            </div>
            <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
              Not yet wired to downstream systems
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkQueueSection() {
  const [groupBy, setGroupBy] = useState<'brand' | 'market'>('brand');

  const severityIcon = {
    critical: '\uD83D\uDD34',
    warning: '\uD83D\uDFE1',
    info: '\uD83D\uDD35',
  };

  const quickActions = [
    { label: 'Create Product', icon: '\u2795' },
    { label: 'Create Bundle', icon: '\uD83D\uDCE6' },
    { label: 'Bulk Import', icon: '\u2B06\uFE0F' },
    { label: 'Migration Issues', icon: '\uD83D\uDD04' },
    { label: 'Review Duplicates', icon: '\uD83D\uDD0D' },
  ];

  return (
    <section>
      <SectionHeader
        title="Work Queue"
        subtitle={`${URGENT_TASKS.length} items requiring attention`}
        action={{ label: 'View all tasks', onClick: () => {} }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: spacing[4] }}>
        {/* Task list */}
        <div style={{
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
        }}>
          {/* Group toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[3]} ${spacing[4]}`,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}>
            <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight }}>Group by:</span>
            {(['brand', 'market'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                style={{
                  ...typography.label.sm,
                  padding: '4px 12px',
                  borderRadius: borderRadius.full,
                  border: 'none',
                  backgroundColor: groupBy === g ? colors.brand.default : colors.chipBg.enabled,
                  color: groupBy === g ? '#FFFFFF' : colors.text.highEmphasis.onLight,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Tasks */}
          {URGENT_TASKS.map(task => (
            <div
              key={task.id}
              style={{
                padding: `${spacing[3]} ${spacing[4]}`,
                borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 14 }}>{severityIcon[task.severity]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>
                  {task.description}
                </div>
                <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight, marginTop: 1 }}>
                  {task.brand} &middot; {task.market} &middot; {task.productCount} product{task.productCount > 1 ? 's' : ''} &middot; Due {task.dueDate}
                </div>
              </div>
              <StatusBadge status={task.severity === 'critical' ? 'critical' : task.severity === 'warning' ? 'warning' : 'info'} />
            </div>
          ))}
        </div>

        {/* Quick actions + backlog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
          {/* Quick actions */}
          <div style={{
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadius.lg,
            padding: spacing[4],
          }}>
            <div style={{
              ...typography.label.md,
              color: colors.text.highEmphasis.onLight,
              marginBottom: spacing[3],
            }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              {quickActions.map(a => (
                <button
                  key={a.label}
                  style={{
                    ...typography.body.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: `${spacing[2]} ${spacing[3]}`,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    backgroundColor: colors.surface.light,
                    color: colors.text.highEmphasis.onLight,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Backlog */}
          <div style={{
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadius.lg,
            padding: spacing[4],
          }}>
            <div style={{
              ...typography.label.md,
              color: colors.text.lowEmphasis.onLight,
              marginBottom: spacing[3],
            }}>Backlog</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', ...typography.body.sm }}>
                <span style={{ color: colors.text.lowEmphasis.onLight }}>Missing images</span>
                <span style={{ color: colors.text.highEmphasis.onLight, fontWeight: 500 }}>41</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', ...typography.body.sm }}>
                <span style={{ color: colors.text.lowEmphasis.onLight }}>No market assigned</span>
                <span style={{ color: colors.text.highEmphasis.onLight, fontWeight: 500 }}>8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', ...typography.body.sm }}>
                <span style={{ color: colors.text.lowEmphasis.onLight }}>No labels attached</span>
                <span style={{ color: colors.text.highEmphasis.onLight, fontWeight: 500 }}>23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentActivitySection() {
  const actionColors = {
    created: { bg: colors.badge.successLight, text: colors.badge.success },
    updated: { bg: colors.badge.infoLight, text: colors.badge.info },
    archived: { bg: colors.badge.charcoalLight, text: colors.badge.charcoal },
  };

  return (
    <section>
      <SectionHeader
        title="Recent Activity"
        subtitle="Last 7 days across all brands"
        action={{ label: 'View activity log', onClick: () => {} }}
      />

      {/* Summary counts */}
      <div style={{ display: 'flex', gap: spacing[4], marginBottom: spacing[4] }}>
        <div style={{
          flex: 1,
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[3]} ${spacing[4]}`,
          textAlign: 'center',
        }}>
          <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Created</div>
          <div style={{
            fontFamily: fontFamilies.display, fontSize: '22px', fontWeight: 600,
            color: colors.text.success,
          }}>18</div>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[3]} ${spacing[4]}`,
          textAlign: 'center',
        }}>
          <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Updated</div>
          <div style={{
            fontFamily: fontFamilies.display, fontSize: '22px', fontWeight: 600,
            color: colors.status.info,
          }}>47</div>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[3]} ${spacing[4]}`,
          textAlign: 'center',
        }}>
          <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>Archived</div>
          <div style={{
            fontFamily: fontFamilies.display, fontSize: '22px', fontWeight: 600,
            color: colors.text.lowEmphasis.onLight,
          }}>3</div>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: colors.surface.warning,
          border: `1px solid ${colors.surfaceBorder.warning}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[3]} ${spacing[4]}`,
          textAlign: 'center',
          cursor: 'pointer',
        }}>
          <div style={{ ...typography.body.xs, color: colors.text.warning }}>Hotspot</div>
          <div style={{
            ...typography.label.md,
            color: colors.text.warning,
          }}>CA: 45 changes</div>
        </div>
      </div>

      {/* Activity table */}
      <div style={{
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontFamilies.body }}>
          <thead>
            <tr style={{ backgroundColor: colors.surface.lightDarker }}>
              <th style={{ ...thStyle, textAlign: 'left' }}>Product</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 90 }}>Action</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Brand</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 60 }}>Market</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>User</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>When</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ACTIVITY.map((a, i) => (
              <tr key={i} style={{
                borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                cursor: 'pointer',
              }}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{a.product}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: borderRadius.full,
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: actionColors[a.action].bg,
                    color: actionColors[a.action].text,
                    textTransform: 'capitalize',
                  }}>
                    {a.action}
                  </span>
                </td>
                <td style={tdStyle}>{a.brand}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: borderRadius.sm,
                    backgroundColor: colors.surface.lightDarker,
                    ...typography.label.sm,
                  }}>{a.market}</span>
                </td>
                <td style={tdStyle}>{a.user}</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: colors.text.lowEmphasis.onLight }}>
                  {a.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComplianceRiskSection() {
  return (
    <section>
      <SectionHeader
        title="Compliance Readiness by Market"
        subtitle="State-level compliance status"
        action={{ label: 'View all compliance tasks', onClick: () => {} }}
      />

      {/* Urgent compliance banner */}
      <div style={{
        backgroundColor: colors.surface.important,
        border: `1px solid ${colors.surfaceBorder.important}`,
        borderRadius: borderRadius.md,
        padding: `${spacing[3]} ${spacing[4]}`,
        marginBottom: spacing[4],
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
      }}>
        <span style={{ fontSize: 18 }}>{'\uD83D\uDEA8'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ ...typography.label.md, color: colors.text.important }}>
            15 products in CA need updated THC warnings by 03/01/2026
          </div>
          <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
            New state regulation effective March 1st
          </div>
        </div>
        <button style={{
          ...typography.label.sm,
          padding: '6px 14px',
          borderRadius: borderRadius.md,
          backgroundColor: colors.action.important.enabled,
          color: '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
        }}>
          Review Now
        </button>
      </div>

      {/* Market compliance table */}
      <div style={{
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontFamilies.body }}>
          <thead>
            <tr style={{ backgroundColor: colors.surface.lightDarker }}>
              <th style={{ ...thStyle, textAlign: 'left' }}>Market</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Compliance</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 90 }}>Products</th>
              <th style={{ ...thStyle, textAlign: 'center', width: 100 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {MARKETS.map(m => (
              <tr key={m.state} style={{
                borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                cursor: 'pointer',
              }}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 6px',
                    borderRadius: borderRadius.sm,
                    backgroundColor: colors.surface.lightDarker,
                    ...typography.label.sm,
                    marginRight: 8,
                  }}>{m.state}</span>
                  {m.name}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ProgressBar value={m.compliant} size="sm" />
                    <span style={{ ...typography.label.sm, width: 36, textAlign: 'right' }}>{m.compliant}%</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{m.products}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <StatusBadge status={m.compliant >= 90 ? 'success' : m.compliant >= 75 ? 'warning' : 'critical'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// =============================================================================
// SHARED TABLE STYLES
// =============================================================================

const thStyle: React.CSSProperties = {
  ...typography.label.sm,
  color: colors.text.lowEmphasis.onLight,
  padding: `${spacing[2]} ${spacing[4]}`,
  fontWeight: 500,
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  ...typography.body.sm,
  padding: `${spacing[2]} ${spacing[4]}`,
  color: colors.text.highEmphasis.onLight,
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function MSOHomepage() {
  const { themeName, setThemeName } = useThemeSwitcher();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.surface.lightDarker,
      fontFamily: fontFamilies.body,
    }}>
      {/* Floating theme switcher — bottom-left */}
      <div style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        <label style={{
          fontFamily: fontFamilies.body,
          fontSize: '11px',
          fontWeight: 500,
          color: colors.text.lowEmphasis.onLight,
        }}>Prototype Theme</label>
        <select
          value={themeName}
          onChange={e => setThemeName(e.target.value)}
          style={{
            padding: '6px 28px 6px 10px',
            fontFamily: fontFamilies.body,
            fontSize: '13px',
            border: `1px solid ${colors.border.midEmphasis.onLight}`,
            borderRadius: borderRadius.sm,
            backgroundColor: colors.surface.light,
            color: colors.text.highEmphasis.onLight,
            cursor: 'pointer',
            appearance: 'none' as const,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 6px center',
            boxShadow: shadows.sm,
          }}
        >
          {availableThemes.map(t => (
            <option key={t.name} value={t.name}>
              {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {/* Top header bar — matches Figma Nav Header-canopy pattern */}
      <header style={{
        backgroundColor: colors.surface.light,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
        padding: `0 ${spacing[5]}`,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Left: App switcher + GCR logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          {/* App grid icon */}
          <button style={{
            width: 36, height: 36, border: 'none', background: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: colors.icon.enabled.onLight, fontSize: 18,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="8" y="1" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="15" y="1" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="1" y="8" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="8" y="8" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="15" y="8" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="1" y="15" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="8" y="15" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="15" y="15" width="4" height="4" rx="1" fill="currentColor" />
            </svg>
          </button>
          {/* GCR logo + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: borderRadius.md,
              backgroundColor: colors.brand.default,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{
                fontFamily: fontFamilies.display, fontSize: '15px', fontWeight: 600,
                color: colors.text.highEmphasis.onLight, lineHeight: '18px',
              }}>GCR</div>
              <div style={{
                ...typography.body.xs,
                color: colors.text.lowEmphasis.onLight,
                lineHeight: '14px',
              }}>Global Cannabis Registry</div>
            </div>
          </div>
        </div>

        {/* Center: Search bar */}
        <div style={{
          flex: '0 1 480px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: borderRadius.full,
          border: `1px solid ${colors.border.midEmphasis.onLight}`,
          backgroundColor: colors.surface.light,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke={colors.icon.enabled.onLight} strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14" y2="14" stroke={colors.icon.enabled.onLight} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{
            ...typography.body.sm,
            color: colors.text.disabled.onLight,
          }}>Find or ask about a product or integration</span>
          <div style={{ marginLeft: 'auto' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="4" r="2" fill={colors.icon.enabled.onLight} />
              <path d="M8 7v6M5 11l3 3 3-3" stroke={colors.icon.enabled.onLight} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right: Icons + org */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          {/* Bell icon */}
          <button style={{
            width: 36, height: 36, border: 'none', background: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: colors.icon.enabled.onLight, borderRadius: borderRadius.full,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2a5 5 0 00-5 5v3l-1.5 2.5h13L15 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 16.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          {/* Help icon */}
          <button style={{
            width: 36, height: 36, border: 'none', background: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: colors.icon.enabled.onLight, borderRadius: borderRadius.full,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 7.5a2.5 2.5 0 013.5 2.3c0 1.2-1.5 1.7-1.5 1.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="10" cy="14" r="0.8" fill="currentColor" />
            </svg>
          </button>
          {/* Org avatar + name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 12px 4px 4px',
            borderRadius: borderRadius.full,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: borderRadius.full,
              backgroundColor: colors.avatar['05'],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: colors.brand.default,
            }}>ON</div>
            <div>
              <div style={{
                ...typography.label.sm,
                color: colors.text.highEmphasis.onLight,
                lineHeight: '16px',
              }}>Organization Name</div>
              <div style={{
                fontSize: '11px',
                color: colors.text.lowEmphasis.onLight,
                lineHeight: '14px',
              }}>Organization</div>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: `${spacing[6]} ${spacing[6]} ${spacing[12]}`,
      }}>
        {/* Page title — matches Figma Hero section pattern */}
        <div style={{ marginBottom: spacing[5], paddingTop: spacing[2] }}>
          <h1 style={{
            fontFamily: fontFamilies.display,
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '40px',
            letterSpacing: '-0.5px',
            color: colors.text.highEmphasis.onLight,
            margin: 0,
          }}>
            Dashboard
          </h1>
          <p style={{
            ...typography.body.lg,
            color: colors.text.lowEmphasis.onLight,
            margin: '8px 0 0 0',
          }}>
            Your complete business overview across all brands and markets.
          </p>
        </div>

        {/* Dashboard sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
          <CatalogOverview />
          <DataQualitySection />
          <MigrationSection />
          <WorkQueueSection />
          <ComplianceRiskSection />
          <RecentActivitySection />
        </div>
      </main>
    </div>
  );
}
