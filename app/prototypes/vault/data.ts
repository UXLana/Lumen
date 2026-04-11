/**
 * Mock data for the Vault fintech prototype.
 *
 * Realistic business banking scenarios:
 * - 4 accounts (Operating, Payroll, Savings, Expense card)
 * - 6 cards (mix of virtual + physical, different cardholders)
 * - 8 team members (founder, CFO, controller, ops, engineers)
 * - 50+ transactions (mix of credits, debits, pending, failed)
 * - 30 days of cashflow for the chart
 */

export interface Account {
  id: string
  name: string
  type: 'operating' | 'savings' | 'expense' | 'payroll'
  number: string
  balance: number
  currency: string
  interestRate?: number
  lastUpdated: string
}

export const ACCOUNTS: Account[] = [
  {
    id: 'acc-operating',
    name: 'Operating',
    type: 'operating',
    number: '1234',
    balance: 1847392.14,
    currency: 'USD',
    lastUpdated: '8 seconds ago',
  },
  {
    id: 'acc-savings',
    name: 'High-yield savings',
    type: 'savings',
    number: '5678',
    balance: 500000.0,
    currency: 'USD',
    interestRate: 4.82,
    lastUpdated: '1 minute ago',
  },
  {
    id: 'acc-payroll',
    name: 'Payroll',
    type: 'payroll',
    number: '9012',
    balance: 128543.8,
    currency: 'USD',
    lastUpdated: '12 seconds ago',
  },
  {
    id: 'acc-expense',
    name: 'Expense cards',
    type: 'expense',
    number: '3456',
    balance: 5392.0,
    currency: 'USD',
    lastUpdated: '4 seconds ago',
  },
]

export const TOTAL_BALANCE = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0)

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

export type TransactionStatus = 'posted' | 'pending' | 'failed'
export type TransactionDirection = 'credit' | 'debit'
export type TransactionCategory =
  | 'payroll'
  | 'saas'
  | 'office'
  | 'travel'
  | 'legal'
  | 'marketing'
  | 'revenue'
  | 'transfer'
  | 'tax'
  | 'utilities'
  | 'uncategorized'

export interface Transaction {
  id: string
  date: string
  description: string
  counterparty: string
  category: TransactionCategory
  amount: number // positive for credits, negative for debits
  status: TransactionStatus
  account: string
  reference?: string
}

export const TRANSACTIONS: Transaction[] = [
  { id: 'tx-0051', date: '2026-04-05', description: 'Wire transfer in', counterparty: 'Northwind Capital Partners', category: 'revenue', amount: 240000.0, status: 'posted', account: 'Operating • 1234', reference: 'INV-2026-0418' },
  { id: 'tx-0050', date: '2026-04-05', description: 'AWS - April 2026', counterparty: 'Amazon Web Services', category: 'saas', amount: -18472.39, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0049', date: '2026-04-05', description: 'Payroll run - April 1', counterparty: 'Gusto Payroll', category: 'payroll', amount: -124800.0, status: 'pending', account: 'Payroll • 9012' },
  { id: 'tx-0048', date: '2026-04-05', description: 'Uber for Business', counterparty: 'Uber Technologies', category: 'travel', amount: -247.18, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0047', date: '2026-04-04', description: 'Stripe payout', counterparty: 'Stripe Inc.', category: 'revenue', amount: 48291.5, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0046', date: '2026-04-04', description: 'Figma - Professional plan', counterparty: 'Figma Inc.', category: 'saas', amount: -1440.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0045', date: '2026-04-04', description: 'WeWork office - Main', counterparty: 'WeWork', category: 'office', amount: -9800.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0044', date: '2026-04-04', description: 'Google Workspace', counterparty: 'Google LLC', category: 'saas', amount: -612.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0043', date: '2026-04-04', description: 'ACH transfer out', counterparty: 'Wilson Sonsini Goodrich & Rosati', category: 'legal', amount: -22500.0, status: 'pending', account: 'Operating • 1234', reference: 'Retainer Q2' },
  { id: 'tx-0042', date: '2026-04-03', description: 'Wire transfer in', counterparty: 'Acme Corp Holdings', category: 'revenue', amount: 85000.0, status: 'posted', account: 'Operating • 1234', reference: 'INV-2026-0412' },
  { id: 'tx-0041', date: '2026-04-03', description: 'LinkedIn Ads', counterparty: 'LinkedIn Corporation', category: 'marketing', amount: -4820.15, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0040', date: '2026-04-03', description: 'Datadog - April', counterparty: 'Datadog Inc.', category: 'saas', amount: -3240.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0039', date: '2026-04-03', description: 'Transfer to savings', counterparty: 'Internal transfer', category: 'transfer', amount: -100000.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0038', date: '2026-04-03', description: 'Transfer from operating', counterparty: 'Internal transfer', category: 'transfer', amount: 100000.0, status: 'posted', account: 'High-yield savings • 5678' },
  { id: 'tx-0037', date: '2026-04-02', description: 'Delta Airlines', counterparty: 'Delta Air Lines', category: 'travel', amount: -1842.4, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0036', date: '2026-04-02', description: 'Notion - Team plan', counterparty: 'Notion Labs', category: 'saas', amount: -384.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0035', date: '2026-04-02', description: 'Stripe payout', counterparty: 'Stripe Inc.', category: 'revenue', amount: 62184.72, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0034', date: '2026-04-02', description: 'Hilton San Francisco', counterparty: 'Hilton Hotels', category: 'travel', amount: -928.5, status: 'failed', account: 'Expense cards • 3456' },
  { id: 'tx-0033', date: '2026-04-02', description: 'Vercel - Pro plan', counterparty: 'Vercel Inc.', category: 'saas', amount: -240.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0032', date: '2026-04-01', description: 'Wire transfer in', counterparty: 'Meridian Ventures LP', category: 'revenue', amount: 125000.0, status: 'posted', account: 'Operating • 1234', reference: 'INV-2026-0408' },
  { id: 'tx-0031', date: '2026-04-01', description: 'PG&E Utilities', counterparty: 'Pacific Gas & Electric', category: 'utilities', amount: -1240.8, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0030', date: '2026-04-01', description: 'Quarterly tax payment', counterparty: 'U.S. Treasury', category: 'tax', amount: -82400.0, status: 'posted', account: 'Operating • 1234', reference: 'Q1 2026 estimated' },
  { id: 'tx-0029', date: '2026-04-01', description: 'Linear - Team', counterparty: 'Linear Orbit', category: 'saas', amount: -192.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0028', date: '2026-04-01', description: 'Slack - Business+', counterparty: 'Slack Technologies', category: 'saas', amount: -840.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0027', date: '2026-03-31', description: 'Shopify payout', counterparty: 'Shopify Inc.', category: 'revenue', amount: 31842.15, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0026', date: '2026-03-31', description: '1Password - Business', counterparty: '1Password', category: 'saas', amount: -192.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0025', date: '2026-03-31', description: 'Payroll run - March 31', counterparty: 'Gusto Payroll', category: 'payroll', amount: -122400.0, status: 'posted', account: 'Payroll • 9012' },
  { id: 'tx-0024', date: '2026-03-30', description: 'Brex card - Team meal', counterparty: 'Tartine Manufactory', category: 'office', amount: -284.6, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0023', date: '2026-03-30', description: 'Cloudflare Workers', counterparty: 'Cloudflare Inc.', category: 'saas', amount: -120.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0022', date: '2026-03-30', description: 'Wire transfer in', counterparty: 'Horizon Partners', category: 'revenue', amount: 60000.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0021', date: '2026-03-29', description: 'Google Ads', counterparty: 'Google LLC', category: 'marketing', amount: -3120.48, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0020', date: '2026-03-29', description: 'Sentry - Team plan', counterparty: 'Functional Software', category: 'saas', amount: -312.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0019', date: '2026-03-29', description: 'Office lease - April', counterparty: 'Kilroy Realty', category: 'office', amount: -18000.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0018', date: '2026-03-28', description: 'ACH transfer in', counterparty: 'Blue Ridge Capital', category: 'revenue', amount: 42000.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0017', date: '2026-03-28', description: 'Airtable - Pro plan', counterparty: 'Formagrid Inc.', category: 'saas', amount: -240.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0016', date: '2026-03-28', description: 'Stripe payout', counterparty: 'Stripe Inc.', category: 'revenue', amount: 51240.8, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0015', date: '2026-03-27', description: 'Lyft for Business', counterparty: 'Lyft Inc.', category: 'travel', amount: -184.2, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0014', date: '2026-03-27', description: 'Intercom - Starter', counterparty: 'Intercom R&D', category: 'saas', amount: -490.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0013', date: '2026-03-27', description: 'Southwest Airlines', counterparty: 'Southwest Airlines', category: 'travel', amount: -648.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0012', date: '2026-03-26', description: 'PagerDuty - Business', counterparty: 'PagerDuty Inc.', category: 'saas', amount: -840.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0011', date: '2026-03-26', description: 'Wire transfer in', counterparty: 'Cascadia Industries', category: 'revenue', amount: 178000.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0010', date: '2026-03-26', description: 'Marriott - team offsite', counterparty: 'Marriott International', category: 'travel', amount: -4820.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0009', date: '2026-03-25', description: 'GitHub - Enterprise', counterparty: 'GitHub Inc.', category: 'saas', amount: -2100.0, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0008', date: '2026-03-25', description: 'Stripe payout', counterparty: 'Stripe Inc.', category: 'revenue', amount: 34820.15, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0007', date: '2026-03-24', description: 'Mailchimp - Standard', counterparty: 'The Rocket Science Group', category: 'marketing', amount: -299.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0006', date: '2026-03-24', description: 'Twilio - Usage', counterparty: 'Twilio Inc.', category: 'saas', amount: -1842.35, status: 'posted', account: 'Operating • 1234' },
  { id: 'tx-0005', date: '2026-03-23', description: 'Apple - Developer Program', counterparty: 'Apple Inc.', category: 'saas', amount: -99.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0004', date: '2026-03-23', description: 'DocuSign - Business Pro', counterparty: 'DocuSign Inc.', category: 'saas', amount: -480.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0003', date: '2026-03-22', description: 'Wire transfer out', counterparty: 'Brightstone Holdings', category: 'legal', amount: -45000.0, status: 'posted', account: 'Operating • 1234', reference: 'Settlement' },
  { id: 'tx-0002', date: '2026-03-22', description: 'Zoom - Business', counterparty: 'Zoom Video Communications', category: 'saas', amount: -2100.0, status: 'posted', account: 'Expense cards • 3456' },
  { id: 'tx-0001', date: '2026-03-21', description: 'Transfer to payroll', counterparty: 'Internal transfer', category: 'transfer', amount: -125000.0, status: 'posted', account: 'Operating • 1234' },
]

// ---------------------------------------------------------------------------
// Pending approvals
// ---------------------------------------------------------------------------

export interface PendingApproval {
  id: string
  type: 'transfer' | 'wire' | 'payroll'
  recipient: string
  amount: number
  requestedBy: string
  requestedAt: string
  memo?: string
}

export const PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 'app-001',
    type: 'wire',
    recipient: 'Wilson Sonsini Goodrich & Rosati',
    amount: 22500.0,
    requestedBy: 'Priya Shah',
    requestedAt: '12 min ago',
    memo: 'Q2 retainer',
  },
  {
    id: 'app-002',
    type: 'transfer',
    recipient: 'Payroll account',
    amount: 50000.0,
    requestedBy: 'Tomás Rivera',
    requestedAt: '1 hour ago',
  },
  {
    id: 'app-003',
    type: 'wire',
    recipient: 'Arrowhead Manufacturing',
    amount: 87450.0,
    requestedBy: 'Maya Chen',
    requestedAt: '3 hours ago',
    memo: 'PO-2026-184',
  },
]

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

export interface VaultCard {
  id: string
  type: 'virtual' | 'physical'
  nickname: string
  last4: string
  cardholder: string
  cardholderInitials: string
  status: 'active' | 'frozen' | 'expired'
  spendLimit: number
  spendPeriod: 'daily' | 'weekly' | 'monthly'
  spentThisPeriod: number
  merchantCategory?: string
}

export const CARDS: VaultCard[] = [
  {
    id: 'card-01',
    type: 'virtual',
    nickname: 'SaaS subscriptions',
    last4: '4821',
    cardholder: 'Maya Chen',
    cardholderInitials: 'MC',
    status: 'active',
    spendLimit: 10000,
    spendPeriod: 'monthly',
    spentThisPeriod: 4820.15,
    merchantCategory: 'Software',
  },
  {
    id: 'card-02',
    type: 'physical',
    nickname: 'Maya — travel',
    last4: '9374',
    cardholder: 'Maya Chen',
    cardholderInitials: 'MC',
    status: 'active',
    spendLimit: 5000,
    spendPeriod: 'monthly',
    spentThisPeriod: 2470.6,
  },
  {
    id: 'card-03',
    type: 'virtual',
    nickname: 'Google Ads',
    last4: '1158',
    cardholder: 'Priya Shah',
    cardholderInitials: 'PS',
    status: 'active',
    spendLimit: 15000,
    spendPeriod: 'monthly',
    spentThisPeriod: 7940.63,
    merchantCategory: 'Advertising',
  },
  {
    id: 'card-04',
    type: 'physical',
    nickname: 'Tomás — travel',
    last4: '7702',
    cardholder: 'Tomás Rivera',
    cardholderInitials: 'TR',
    status: 'active',
    spendLimit: 5000,
    spendPeriod: 'monthly',
    spentThisPeriod: 1428.9,
  },
  {
    id: 'card-05',
    type: 'virtual',
    nickname: 'Office supplies',
    last4: '6648',
    cardholder: 'Jordan Lee',
    cardholderInitials: 'JL',
    status: 'frozen',
    spendLimit: 2000,
    spendPeriod: 'monthly',
    spentThisPeriod: 0,
  },
  {
    id: 'card-06',
    type: 'physical',
    nickname: 'Priya — entertainment',
    last4: '3921',
    cardholder: 'Priya Shah',
    cardholderInitials: 'PS',
    status: 'active',
    spendLimit: 3000,
    spendPeriod: 'monthly',
    spentThisPeriod: 843.2,
  },
]

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export interface TeamMember {
  id: string
  name: string
  initials: string
  email: string
  role: 'owner' | 'admin' | 'approver' | 'member' | 'bookkeeper'
  lastActive: string
  avatarColor: 'brand' | 'info' | 'warning' | 'success' | 'error'
}

export const TEAM: TeamMember[] = [
  { id: 't1', name: 'Maya Chen', initials: 'MC', email: 'maya@acme.co', role: 'owner', lastActive: 'Online now', avatarColor: 'brand' },
  { id: 't2', name: 'Tomás Rivera', initials: 'TR', email: 'tomas@acme.co', role: 'admin', lastActive: '12 min ago', avatarColor: 'info' },
  { id: 't3', name: 'Priya Shah', initials: 'PS', email: 'priya@acme.co', role: 'approver', lastActive: '1 hour ago', avatarColor: 'warning' },
  { id: 't4', name: 'Jordan Lee', initials: 'JL', email: 'jordan@acme.co', role: 'member', lastActive: '2 hours ago', avatarColor: 'success' },
  { id: 't5', name: 'Sam Okafor', initials: 'SO', email: 'sam@acme.co', role: 'member', lastActive: 'Yesterday', avatarColor: 'error' },
  { id: 't6', name: 'Chloe Park', initials: 'CP', email: 'chloe@acme.co', role: 'member', lastActive: '2 days ago', avatarColor: 'brand' },
  { id: 't7', name: 'Diego Ramos', initials: 'DR', email: 'diego@acme.co', role: 'member', lastActive: '4 days ago', avatarColor: 'info' },
  { id: 't8', name: 'Rachel Weiss (Accountant)', initials: 'RW', email: 'rachel@weisscpa.com', role: 'bookkeeper', lastActive: '1 week ago', avatarColor: 'warning' },
]

// ---------------------------------------------------------------------------
// Cashflow chart data — last 30 days
// ---------------------------------------------------------------------------

export interface CashflowPoint {
  label: string
  value: number
}

// Synthetic 30-day cashflow with realistic peaks/troughs (payroll drops, revenue spikes)
export const CASHFLOW_30D: CashflowPoint[] = [
  { label: 'Mar 7', value: 1924000 },
  { label: 'Mar 8', value: 1918000 },
  { label: 'Mar 9', value: 1912000 },
  { label: 'Mar 10', value: 1978000 },
  { label: 'Mar 11', value: 1972000 },
  { label: 'Mar 12', value: 1965000 },
  { label: 'Mar 13', value: 1958000 },
  { label: 'Mar 14', value: 1952000 },
  { label: 'Mar 15', value: 2018000 },
  { label: 'Mar 16', value: 2011000 },
  { label: 'Mar 17', value: 2004000 },
  { label: 'Mar 18', value: 1998000 },
  { label: 'Mar 19', value: 1991000 },
  { label: 'Mar 20', value: 1984000 },
  { label: 'Mar 21', value: 1856000 },
  { label: 'Mar 22', value: 1812000 },
  { label: 'Mar 23', value: 1804000 },
  { label: 'Mar 24', value: 1798000 },
  { label: 'Mar 25', value: 1832000 },
  { label: 'Mar 26', value: 2009000 },
  { label: 'Mar 27', value: 2001000 },
  { label: 'Mar 28', value: 2043000 },
  { label: 'Mar 29', value: 2036000 },
  { label: 'Mar 30', value: 2068000 },
  { label: 'Mar 31', value: 1943000 },
  { label: 'Apr 1', value: 1986000 },
  { label: 'Apr 2', value: 2048000 },
  { label: 'Apr 3', value: 2033000 },
  { label: 'Apr 4', value: 2129000 },
  { label: 'Apr 5', value: 2481000 },
]

// Sparkline data for stats cards
export const SPARK_INFLOWS = [62, 48, 85, 42, 51, 60, 48, 35, 62, 62, 42, 178, 60, 240, 85]
export const SPARK_OUTFLOWS = [24, 45, 12, 18, 82, 45, 22, 12, 14, 19, 22, 45, 28, 18, 125]
