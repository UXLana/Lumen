import React, { useState, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// =============================================================================
// MTR DESIGN TOKENS
// =============================================================================

const colors = {
  brand: {
    primary: '#13352C',
    primaryLight: '#1A4A3D',
    primaryDark: '#0D2920',
  },
  primary: {
    50: '#E6F0ED',
    100: '#C2DAD3',
    200: '#9AC3B7',
    300: '#72AC9B',
    400: '#539A85',
    500: '#13352C',
    600: '#2F7A65',
    700: '#276956',
    800: '#1F5847',
    900: '#0D2920',
  },
  secondary: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  semantic: {
    success: { light: '#E8F5E9', main: '#4CAF50', dark: '#2E7D32', contrast: '#FFFFFF' },
    warning: { light: '#FFF3E0', main: '#FF9800', dark: '#E65100', contrast: '#000000' },
    error: { light: '#FFEBEE', main: '#F44336', dark: '#C62828', contrast: '#FFFFFF' },
    info: { light: '#E3F2FD', main: '#2196F3', dark: '#1565C0', contrast: '#FFFFFF' },
  },
  text: {
    highEmphasis: 'rgba(0, 0, 0, 0.95)',
    mediumEmphasis: 'rgba(0, 0, 0, 0.70)',
    lowEmphasis: 'rgba(0, 0, 0, 0.50)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    highEmphasisOnDark: '#FFFFFF',
    mediumEmphasisOnDark: 'rgba(255, 255, 255, 0.74)',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    elevated: '#FFFFFF',
    dark: '#13352C',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  border: {
    light: 'rgba(0, 0, 0, 0.12)',
    main: 'rgba(0, 0, 0, 0.23)',
    dark: 'rgba(0, 0, 0, 0.42)',
    focus: '#13352C',
  },
};

const spacing = {
  0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
  5: '20px', 6: '24px', 7: '28px', 8: '32px', 10: '40px',
  12: '48px', 16: '64px',
};

const borderRadius = {
  none: '0px', xs: '2px', sm: '4px', md: '8px',
  lg: '12px', xl: '16px', '2xl': '24px', full: '9999px',
};

const shadows = {
  xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  brand: '0px 4px 14px rgba(19, 53, 44, 0.25)',
};

const typography = {
  fontFamily: '"DM Sans", sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", monospace',
  heading: {
    h1: { fontSize: '32px', lineHeight: '40px', fontWeight: 600, letterSpacing: '-0.5px' },
    h2: { fontSize: '28px', lineHeight: '36px', fontWeight: 600, letterSpacing: '-0.3px' },
    h3: { fontSize: '24px', lineHeight: '32px', fontWeight: 600, letterSpacing: '-0.2px' },
    h4: { fontSize: '20px', lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.1px' },
    h5: { fontSize: '18px', lineHeight: '24px', fontWeight: 600, letterSpacing: '0px' },
    h6: { fontSize: '16px', lineHeight: '24px', fontWeight: 600, letterSpacing: '0px' },
  },
  body: {
    xl: { fontSize: '20px', lineHeight: '30px', fontWeight: 400 },
    lg: { fontSize: '18px', lineHeight: '28px', fontWeight: 400 },
    md: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
    sm: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
    xs: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
  },
  label: {
    lg: { fontSize: '16px', lineHeight: '24px', fontWeight: 500 },
    md: { fontSize: '14px', lineHeight: '20px', fontWeight: 500 },
    sm: { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
  },
};

const transitions = {
  fast: '100ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-in-out',
};

// =============================================================================
// MTR PRIMITIVE COMPONENTS (Following component-generator patterns)
// =============================================================================

// Badge Component
const Badge = ({ variant = 'filled', semantic = 'info', size = 'md', children, style = {} }) => {
  const semanticColors = {
    success: { bg: colors.semantic.success.light, text: colors.semantic.success.dark, dot: colors.semantic.success.main },
    warning: { bg: colors.semantic.warning.light, text: colors.semantic.warning.dark, dot: colors.semantic.warning.main },
    error: { bg: colors.semantic.error.light, text: colors.semantic.error.dark, dot: colors.semantic.error.main },
    info: { bg: colors.semantic.info.light, text: colors.semantic.info.dark, dot: colors.semantic.info.main },
    neutral: { bg: colors.neutral[100], text: colors.text.mediumEmphasis, dot: colors.neutral[500] },
  };

  const colorScheme = semanticColors[semantic];
  const sizeConfig = {
    sm: { padding: `${spacing[1]} ${spacing[2]}`, fontSize: typography.body.xs.fontSize },
    md: { padding: `${spacing[1]} ${spacing[3]}`, fontSize: typography.label.sm.fontSize },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing[1],
      padding: sizeConfig[size].padding,
      fontSize: sizeConfig[size].fontSize,
      fontWeight: 500,
      fontFamily: typography.fontFamily,
      backgroundColor: colorScheme.bg,
      color: colorScheme.text,
      borderRadius: borderRadius.full,
      transition: transitions.fast,
      ...style,
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: colorScheme.dot,
      }} />
      {children}
    </span>
  );
};

// Button Component (Following MTR button tokens)
const Button = ({
  emphasis = 'high',
  size = 'md',
  destructive = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  children,
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeConfig = {
    sm: { height: '32px', minWidth: '72px', padding: `0 ${spacing[3]}`, fontSize: '14px', iconSize: '16px' },
    md: { height: '36px', minWidth: '80px', padding: `0 ${spacing[4]}`, fontSize: '14px', iconSize: '20px' },
    lg: { height: '48px', minWidth: '100px', padding: `0 ${spacing[5]}`, fontSize: '16px', iconSize: '24px' },
  };

  const getColors = () => {
    if (disabled) {
      return { bg: colors.neutral[200], text: colors.text.disabled, border: 'transparent' };
    }
    if (emphasis === 'high') {
      if (isPressed) return { bg: colors.brand.primaryDark, text: colors.text.highEmphasisOnDark, border: 'transparent' };
      if (isHovered) return { bg: colors.brand.primaryLight, text: colors.text.highEmphasisOnDark, border: 'transparent' };
      return { bg: colors.brand.primary, text: colors.text.highEmphasisOnDark, border: 'transparent' };
    }
    if (emphasis === 'mid') {
      if (isPressed) return { bg: colors.primary[100], text: colors.brand.primary, border: colors.brand.primary };
      if (isHovered) return { bg: colors.primary[50], text: colors.brand.primary, border: colors.brand.primary };
      return { bg: 'transparent', text: colors.brand.primary, border: colors.brand.primary };
    }
    // low emphasis
    if (isPressed) return { bg: colors.neutral[200], text: colors.text.highEmphasis, border: 'transparent' };
    if (isHovered) return { bg: colors.neutral[100], text: colors.text.highEmphasis, border: 'transparent' };
    return { bg: 'transparent', text: colors.text.mediumEmphasis, border: 'transparent' };
  };

  const colorScheme = getColors();
  const config = sizeConfig[size];

  return (
    <button
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        height: config.height,
        minWidth: config.minWidth,
        padding: config.padding,
        fontFamily: typography.fontFamily,
        fontSize: config.fontSize,
        fontWeight: 600,
        backgroundColor: colorScheme.bg,
        color: colorScheme.text,
        border: colorScheme.border === 'transparent' ? 'none' : `1px solid ${colorScheme.border}`,
        borderRadius: borderRadius.full,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: transitions.normal,
        boxShadow: isHovered && emphasis === 'high' && !disabled ? shadows.brand : 'none',
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
        ...style,
      }}
    >
      {loading ? (
        <span style={{
          width: config.iconSize,
          height: config.iconSize,
          border: `2px solid currentColor`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

// Card Component
const Card = ({
  elevation = 'sm',
  padding = 'md',
  selected = false,
  onClick,
  children,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const elevationMap = {
    none: shadows.xs,
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
  };

  const paddingMap = {
    none: '0',
    sm: spacing[3],
    md: spacing[5],
    lg: spacing[6],
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: colors.background.default,
        borderRadius: borderRadius.lg,
        padding: paddingMap[padding],
        boxShadow: isHovered ? shadows.md : elevationMap[elevation],
        border: selected ? `1px solid ${colors.brand.primary}` : '1px solid transparent',
        transition: transitions.normal,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Banner Component (Following MTR banner tokens)
const Banner = ({
  variant = 'info',
  size = 'md',
  title,
  dismissible = false,
  onDismiss,
  children,
  style = {},
}) => {
  const variantColors = {
    info: { bg: colors.semantic.info.light, border: colors.semantic.info.main, icon: '💡', title: colors.semantic.info.dark },
    success: { bg: colors.semantic.success.light, border: colors.semantic.success.main, icon: '✓', title: colors.semantic.success.dark },
    warning: { bg: colors.semantic.warning.light, border: colors.semantic.warning.main, icon: '⚠', title: colors.semantic.warning.dark },
    error: { bg: colors.semantic.error.light, border: colors.semantic.error.main, icon: '✕', title: colors.semantic.error.dark },
  };

  const sizeConfig = {
    md: { paddingX: spacing[4], paddingY: spacing[3], titleSize: typography.label.md.fontSize },
    lg: { paddingX: spacing[5], paddingY: spacing[4], titleSize: typography.label.lg.fontSize },
  };

  const colorScheme = variantColors[variant];
  const config = sizeConfig[size];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[3],
      padding: `${config.paddingY} ${config.paddingX}`,
      backgroundColor: colorScheme.bg,
      borderLeft: `4px solid ${colorScheme.border}`,
      borderRadius: borderRadius.md,
      fontFamily: typography.fontFamily,
      ...style,
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{colorScheme.icon}</span>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{
            fontSize: config.titleSize,
            fontWeight: 600,
            color: colorScheme.title,
            marginBottom: spacing[1],
          }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: typography.body.sm.fontSize, color: colors.text.mediumEmphasis }}>
          {children}
        </div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: spacing[1],
            color: colors.text.mediumEmphasis,
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Tab Component
const Tab = ({ active = false, onClick, children, style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: `${spacing[3]} ${spacing[5]}`,
        fontFamily: typography.fontFamily,
        fontSize: typography.label.md.fontSize,
        fontWeight: 600,
        color: active ? colors.text.highEmphasisOnDark : isHovered ? colors.text.highEmphasis : colors.text.mediumEmphasis,
        backgroundColor: active ? colors.brand.primary : isHovered ? colors.neutral[100] : 'transparent',
        border: 'none',
        borderRadius: borderRadius.md,
        cursor: 'pointer',
        transition: transitions.normal,
        outline: 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// Progress Bar Component
const ProgressBar = ({ value, variant = 'success', size = 'md', style = {} }) => {
  const variantColors = {
    success: colors.semantic.success.main,
    warning: colors.semantic.warning.main,
    error: colors.semantic.error.main,
    primary: colors.brand.primary,
  };

  const heightMap = { sm: '4px', md: '8px', lg: '12px' };

  return (
    <div style={{
      height: heightMap[size],
      backgroundColor: colors.neutral[200],
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        height: '100%',
        width: `${value}%`,
        backgroundColor: variantColors[variant],
        borderRadius: borderRadius.full,
        transition: `width ${transitions.slow}`,
      }} />
    </div>
  );
};

// Data Table Component
const DataTable = ({ headers, rows, style = {} }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: typography.fontFamily,
        fontSize: typography.body.sm.fontSize,
        ...style,
      }}>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} style={{
                textAlign: 'left',
                padding: `${spacing[3]} ${spacing[4]}`,
                backgroundColor: colors.neutral[50],
                color: colors.text.mediumEmphasis,
                fontWeight: 600,
                fontSize: typography.label.sm.fontSize,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: `1px solid ${colors.border.light}`,
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                transition: transitions.fast,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.neutral[50]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{
                  padding: `${spacing[3]} ${spacing[4]}`,
                  borderBottom: `1px solid ${colors.border.light}`,
                  color: colors.text.highEmphasis,
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Score Ring Component
const ScoreRing = ({ value, label, size = 160, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value >= 90) return colors.semantic.success.main;
    if (value >= 80) return colors.semantic.warning.main;
    return colors.semantic.error.main;
  };

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.neutral[200]}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: `stroke-dashoffset ${transitions.slow}` }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '36px',
          fontWeight: 700,
          color: colors.text.highEmphasis,
          lineHeight: 1,
          fontFamily: typography.fontFamily,
        }}>
          {value.toFixed(1)}
        </div>
        <div style={{
          fontSize: typography.label.sm.fontSize,
          color: colors.text.mediumEmphasis,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ icon, iconVariant = 'info', value, label, trend, trendDirection, selected, onClick }) => {
  const iconBgColors = {
    success: colors.semantic.success.light,
    warning: colors.semantic.warning.light,
    error: colors.semantic.error.light,
    info: colors.semantic.info.light,
  };

  const iconTextColors = {
    success: colors.semantic.success.dark,
    warning: colors.semantic.warning.dark,
    error: colors.semantic.error.dark,
    info: colors.semantic.info.dark,
  };

  const trendColors = {
    up: { bg: colors.semantic.success.light, text: colors.semantic.success.dark },
    down: { bg: colors.semantic.error.light, text: colors.semantic.error.dark },
    neutral: { bg: colors.neutral[100], text: colors.text.mediumEmphasis },
  };

  return (
    <Card elevation="sm" selected={selected} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing[3] }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: borderRadius.md,
          backgroundColor: iconBgColors[iconVariant],
          color: iconTextColors[iconVariant],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[1],
            padding: `${spacing[1]} ${spacing[2]}`,
            fontSize: typography.body.xs.fontSize,
            fontWeight: 500,
            backgroundColor: trendColors[trendDirection]?.bg,
            color: trendColors[trendDirection]?.text,
            borderRadius: borderRadius.full,
          }}>
            {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→'} {trend}
          </span>
        )}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: 700,
        color: colors.text.highEmphasis,
        letterSpacing: '-1px',
        marginBottom: spacing[1],
        fontFamily: typography.fontFamily,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: typography.label.md.fontSize,
        color: colors.text.mediumEmphasis,
        fontWeight: 500,
      }}>
        {label}
      </div>
    </Card>
  );
};

// Metric Item Component
const MetricItem = ({ color, name, value, valueColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[3],
        backgroundColor: isHovered ? colors.primary[50] : colors.neutral[50],
        borderRadius: borderRadius.md,
        transition: transitions.fast,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: color,
        }} />
        <span style={{
          fontSize: typography.label.md.fontSize,
          fontWeight: 500,
          color: colors.text.highEmphasis,
        }}>
          {name}
        </span>
      </div>
      <span style={{
        fontSize: typography.label.md.fontSize,
        fontWeight: 600,
        fontFamily: typography.fontMono,
        color: valueColor,
      }}>
        {value}
      </span>
    </div>
  );
};

// Filter Pill Component
const FilterPill = ({ active, onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: `${spacing[1]} ${spacing[3]}`,
        fontSize: typography.body.xs.fontSize,
        fontWeight: 500,
        fontFamily: typography.fontFamily,
        backgroundColor: active ? colors.brand.primary : isHovered ? colors.primary[50] : colors.neutral[100],
        color: active ? colors.text.highEmphasisOnDark : isHovered ? colors.brand.primary : colors.text.mediumEmphasis,
        border: 'none',
        borderRadius: borderRadius.full,
        cursor: 'pointer',
        transition: transitions.fast,
        outline: 'none',
      }}
    >
      {children}
    </button>
  );
};

// =============================================================================
// SAMPLE DATA
// =============================================================================

const licenseData = [
  { id: 'CO-MED-0001234', name: 'Rocky Mountain Dispensary', type: 'Retail', status: 'compliant', compliance: 98.5, lastReport: '2026-01-12', expiration: '2026-06-15' },
  { id: 'CO-MED-0001235', name: 'Mile High Cultivation', type: 'Cultivator', status: 'warning', compliance: 87.2, lastReport: '2026-01-10', expiration: '2026-02-28' },
  { id: 'CO-MED-0001236', name: 'Denver Processing Co.', type: 'Processor', status: 'compliant', compliance: 95.1, lastReport: '2026-01-13', expiration: '2026-08-20' },
  { id: 'CO-MED-0001237', name: 'Boulder Botanicals', type: 'Cultivator', status: 'compliant', compliance: 99.2, lastReport: '2026-01-14', expiration: '2026-11-30' },
  { id: 'CO-MED-0001238', name: 'Peak Cannabis Labs', type: 'Testing', status: 'compliant', compliance: 100, lastReport: '2026-01-14', expiration: '2026-09-15' },
  { id: 'CO-MED-0001239', name: 'Front Range Edibles', type: 'Processor', status: 'violation', compliance: 72.8, lastReport: '2026-01-08', expiration: '2026-04-10' },
  { id: 'CO-MED-0001240', name: 'Alpine Wellness', type: 'Retail', status: 'compliant', compliance: 94.7, lastReport: '2026-01-13', expiration: '2026-07-22' },
  { id: 'CO-MED-0001241', name: 'Summit County Cannabis', type: 'Retail', status: 'warning', compliance: 85.3, lastReport: '2026-01-11', expiration: '2026-03-15' },
];

const chartData = {
  '6m': [
    { month: 'Aug', value: 91.2 },
    { month: 'Sep', value: 92.1 },
    { month: 'Oct', value: 93.4 },
    { month: 'Nov', value: 92.8 },
    { month: 'Dec', value: 94.1 },
    { month: 'Jan', value: 94.7 },
  ],
  '1y': [
    { month: 'Feb', value: 88.5 },
    { month: 'Apr', value: 89.2 },
    { month: 'Jun', value: 90.1 },
    { month: 'Aug', value: 91.2 },
    { month: 'Oct', value: 92.8 },
    { month: 'Dec', value: 94.1 },
    { month: 'Jan', value: 94.7 },
  ],
  'all': [
    { month: '2023 Q1', value: 78.2 },
    { month: 'Q2', value: 80.1 },
    { month: 'Q3', value: 82.5 },
    { month: 'Q4', value: 84.3 },
    { month: '2024 Q1', value: 85.7 },
    { month: 'Q2', value: 87.2 },
    { month: 'Q3', value: 88.9 },
    { month: 'Q4', value: 90.1 },
    { month: '2025 Q1', value: 91.5 },
    { month: 'Q2', value: 92.3 },
    { month: 'Q3', value: 93.8 },
    { month: 'Q4', value: 94.1 },
    { month: '2026', value: 94.7 },
  ],
};

const transferData = [
  { name: 'Cultivator → Processor', value: 1245 },
  { name: 'Processor → Retail', value: 1567 },
  { name: 'Cultivator → Retail', value: 534 },
  { name: 'Retail → Consumer', value: 496 },
];

const violationData = [
  { type: 'Reporting Delay', count: 8, trend: -2 },
  { type: 'Inventory Discrepancy', count: 6, trend: -4 },
  { type: 'Transfer Error', count: 5, trend: 0 },
  { type: 'Package Labeling', count: 4, trend: -1 },
];

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartPeriod, setChartPeriod] = useState('6m');
  const [tableFilter, setTableFilter] = useState('all');
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const filteredLicenses = useMemo(() => {
    if (tableFilter === 'all') return licenseData;
    return licenseData.filter(l => l.status === tableFilter);
  }, [tableFilter]);

  const getComplianceVariant = (value) => {
    if (value >= 90) return 'success';
    if (value >= 80) return 'warning';
    return 'error';
  };

  const getStatusSemantic = (status) => {
    if (status === 'compliant') return 'success';
    if (status === 'warning') return 'warning';
    return 'error';
  };

  const isExpiringSoon = (date) => {
    const expDate = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: colors.brand.primary,
          color: colors.text.highEmphasisOnDark,
          padding: `${spacing[3]} ${spacing[4]}`,
          borderRadius: borderRadius.md,
          fontFamily: typography.fontFamily,
          boxShadow: shadows.lg,
        }}>
          <div style={{ fontWeight: 600, marginBottom: spacing[1] }}>{label}</div>
          <div style={{ fontFamily: typography.fontMono }}>{payload[0].value}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.paper, fontFamily: typography.fontFamily }}>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header style={{
        backgroundColor: colors.background.dark,
        color: colors.text.highEmphasisOnDark,
        padding: `${spacing[4]} ${spacing[6]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: shadows.md,
        position: 'sticky',
        top: 0,
        zIndex: 300,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: colors.secondary[500],
            borderRadius: borderRadius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '18px',
            color: colors.brand.primary,
          }}>
            M
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.3px' }}>Compliance Dashboard</div>
            <div style={{ fontSize: '14px', color: colors.text.mediumEmphasisOnDark }}>Cannabis Regulatory Tracking</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <span style={{ fontSize: '14px', color: colors.text.mediumEmphasisOnDark, fontFamily: typography.fontMono }}>
            {currentDate}
          </span>
          <Button emphasis="low" size="sm" onClick={() => window.location.reload()}>
            ↻ Refresh
          </Button>
          <Button emphasis="mid" size="sm" style={{
            backgroundColor: 'transparent',
            color: colors.text.highEmphasisOnDark,
            border: `1px solid rgba(255,255,255,0.3)`,
          }}>
            ↓ Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1536px', margin: '0 auto', padding: spacing[6] }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: spacing[1],
          backgroundColor: colors.background.default,
          borderRadius: borderRadius.lg,
          padding: spacing[1],
          marginBottom: spacing[6],
          boxShadow: shadows.sm,
        }}>
          {['overview', 'licenses', 'transfers', 'inventory'].map(tab => (
            <Tab key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Tab>
          ))}
        </div>

        {/* Alert Banner */}
        {showAlert && (
          <Banner
            variant="warning"
            title="3 Licenses Require Attention"
            dismissible
            onDismiss={() => setShowAlert(false)}
            style={{ marginBottom: spacing[6] }}
          >
            Reporting deadlines approaching for Rocky Mountain Dispensary, Mile High Cultivation, and Denver Processing Co.
          </Banner>
        )}

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: spacing[4],
          marginBottom: spacing[6],
        }}>
          <KPICard
            icon="✓"
            iconVariant="success"
            value="94.7%"
            label="Overall Compliance Rate"
            trend="2.3%"
            trendDirection="up"
            selected={selectedKPI === 'compliance'}
            onClick={() => setSelectedKPI(selectedKPI === 'compliance' ? null : 'compliance')}
          />
          <KPICard
            icon="📋"
            iconVariant="info"
            value="1,247"
            label="Active Licenses"
            trend="0"
            trendDirection="neutral"
            selected={selectedKPI === 'licenses'}
            onClick={() => setSelectedKPI(selectedKPI === 'licenses' ? null : 'licenses')}
          />
          <KPICard
            icon="📦"
            iconVariant="warning"
            value="3,842"
            label="Transfers This Month"
            trend="12%"
            trendDirection="up"
            selected={selectedKPI === 'transfers'}
            onClick={() => setSelectedKPI(selectedKPI === 'transfers' ? null : 'transfers')}
          />
          <KPICard
            icon="⚡"
            iconVariant="error"
            value="23"
            label="Open Violations"
            trend="18%"
            trendDirection="down"
            selected={selectedKPI === 'violations'}
            onClick={() => setSelectedKPI(selectedKPI === 'violations' ? null : 'violations')}
          />
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: spacing[6],
          marginBottom: spacing[6],
        }}>
          {/* Main Chart */}
          <Card padding="none">
            <div style={{
              padding: `${spacing[4]} ${spacing[5]}`,
              borderBottom: `1px solid ${colors.border.light}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis }}>
                Compliance Trend
              </span>
              <div style={{ display: 'flex', gap: spacing[2] }}>
                {['6m', '1y', 'all'].map(period => (
                  <FilterPill
                    key={period}
                    active={chartPeriod === period}
                    onClick={() => setChartPeriod(period)}
                  >
                    {period === '6m' ? '6 Months' : period === '1y' ? '1 Year' : 'All Time'}
                  </FilterPill>
                ))}
              </div>
            </div>
            <div style={{ padding: spacing[5], height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData[chartPeriod]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.brand.primary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={colors.brand.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: colors.text.lowEmphasis, fontSize: 12, fontFamily: typography.fontFamily }}
                    axisLine={{ stroke: colors.border.light }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[70, 100]}
                    tick={{ fill: colors.text.lowEmphasis, fontSize: 12, fontFamily: typography.fontMono }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={colors.brand.primary}
                    strokeWidth={3}
                    fill="url(#colorValue)"
                    dot={{ fill: colors.brand.primary, strokeWidth: 2, stroke: colors.neutral[0], r: 5 }}
                    activeDot={{ r: 7, fill: colors.brand.primary, stroke: colors.neutral[0], strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Score Ring */}
          <Card padding="none">
            <div style={{
              padding: `${spacing[4]} ${spacing[5]}`,
              borderBottom: `1px solid ${colors.border.light}`,
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis }}>
                Compliance Score
              </span>
            </div>
            <div style={{ padding: spacing[5] }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[4] }}>
                <ScoreRing value={94.7} label="Score" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                <MetricItem
                  color={colors.semantic.success.main}
                  name="Reporting Compliance"
                  value="97.2%"
                  valueColor={colors.semantic.success.dark}
                />
                <MetricItem
                  color={colors.semantic.success.main}
                  name="Transfer Accuracy"
                  value="95.8%"
                  valueColor={colors.semantic.success.dark}
                />
                <MetricItem
                  color={colors.semantic.warning.main}
                  name="Inventory Reconciliation"
                  value="89.4%"
                  valueColor={colors.semantic.warning.dark}
                />
                <MetricItem
                  color={colors.semantic.success.main}
                  name="License Renewals"
                  value="96.5%"
                  valueColor={colors.semantic.success.dark}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing[6],
          marginBottom: spacing[6],
        }}>
          {/* Transfer Distribution */}
          <Card padding="none">
            <div style={{
              padding: `${spacing[4]} ${spacing[5]}`,
              borderBottom: `1px solid ${colors.border.light}`,
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis }}>
                Transfer Distribution
              </span>
            </div>
            <div style={{ padding: spacing[5], height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transferData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: colors.text.lowEmphasis, fontSize: 12, fontFamily: typography.fontMono }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: colors.text.mediumEmphasis, fontSize: 12, fontFamily: typography.fontFamily }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.brand.primary,
                      border: 'none',
                      borderRadius: borderRadius.md,
                      color: colors.text.highEmphasisOnDark,
                      fontFamily: typography.fontFamily,
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={colors.brand.primary}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Violation Breakdown */}
          <Card padding="none">
            <div style={{
              padding: `${spacing[4]} ${spacing[5]}`,
              borderBottom: `1px solid ${colors.border.light}`,
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis }}>
                Violation Breakdown
              </span>
            </div>
            <div style={{ padding: spacing[5] }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                {violationData.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: spacing[3],
                    backgroundColor: colors.neutral[50],
                    borderRadius: borderRadius.md,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: borderRadius.md,
                        backgroundColor: colors.semantic.error.light,
                        color: colors.semantic.error.dark,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: typography.label.md.fontSize,
                      }}>
                        {item.count}
                      </span>
                      <span style={{ fontWeight: 500, color: colors.text.highEmphasis }}>
                        {item.type}
                      </span>
                    </div>
                    <span style={{
                      fontSize: typography.label.sm.fontSize,
                      fontWeight: 500,
                      color: item.trend < 0 ? colors.semantic.success.dark : item.trend > 0 ? colors.semantic.error.dark : colors.text.mediumEmphasis,
                    }}>
                      {item.trend < 0 ? '↓' : item.trend > 0 ? '↑' : '→'} {Math.abs(item.trend)} from last month
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Licenses Table */}
        <Card padding="none">
          <div style={{
            padding: `${spacing[4]} ${spacing[5]}`,
            borderBottom: `1px solid ${colors.border.light}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.highEmphasis }}>
              License Status Overview
            </span>
            <div style={{ display: 'flex', gap: spacing[2] }}>
              {['all', 'compliant', 'warning', 'violation'].map(filter => (
                <FilterPill
                  key={filter}
                  active={tableFilter === filter}
                  onClick={() => setTableFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </FilterPill>
              ))}
            </div>
          </div>
          <DataTable
            headers={['License ID', 'Licensee Name', 'Type', 'Status', 'Compliance', 'Last Report', 'Expiration']}
            rows={filteredLicenses.map(license => [
              <span style={{ fontFamily: typography.fontMono, fontSize: '13px', color: colors.brand.primary, fontWeight: 500 }}>
                {license.id}
              </span>,
              license.name,
              license.type,
              <Badge semantic={getStatusSemantic(license.status)}>
                {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
              </Badge>,
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <ProgressBar
                  value={license.compliance}
                  variant={getComplianceVariant(license.compliance)}
                  style={{ width: '80px' }}
                />
                <span style={{ fontFamily: typography.fontMono, fontSize: '13px' }}>{license.compliance}%</span>
              </div>,
              <span style={{ fontFamily: typography.fontMono, fontSize: '13px', color: colors.text.mediumEmphasis }}>
                {license.lastReport}
              </span>,
              <span style={{
                fontFamily: typography.fontMono,
                fontSize: '13px',
                color: isExpiringSoon(license.expiration) ? colors.semantic.warning.dark : colors.text.mediumEmphasis,
              }}>
                {license.expiration}
                {isExpiringSoon(license.expiration) && <span style={{ color: colors.semantic.warning.main }}> ⚠</span>}
              </span>,
            ])}
          />
        </Card>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: spacing[6],
        color: colors.text.lowEmphasis,
        fontSize: typography.body.xs.fontSize,
      }}>
        © 2026 Metrc Cannabis Regulatory Tracking · Data refreshed in real-time
      </footer>
    </div>
  );
}