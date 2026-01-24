'use client';

// Prototype metadata
export const screenMeta = {
  name: 'ProductsPage',
  description: 'Main products listing page with stats, filters, and product grid',
  status: 'draft' as const,
  lastUpdated: '2025-01-21',
  fidelity: 'wireframe',
  feedback: [],
};

// Wireframe placeholder component
const Placeholder = ({
  label,
  width = 'w-full',
  height = 'h-8',
  className = ''
}: {
  label?: string;
  width?: string;
  height?: string;
  className?: string;
}) => (
  <div className={`bg-neutral-200 border-2 border-dashed border-neutral-300 flex items-center justify-center text-xs text-neutral-500 ${width} ${height} ${className}`}>
    {label}
  </div>
);

// Wireframe Stats Card
const StatsCardWireframe = ({ label }: { label: string }) => (
  <div className="border-2 border-dashed border-neutral-300 p-4 flex items-center gap-3 min-w-[160px]">
    <Placeholder label="Icon" width="w-10" height="h-10" />
    <div className="space-y-1">
      <Placeholder label={label} width="w-20" height="h-3" />
      <Placeholder label="##" width="w-12" height="h-6" />
    </div>
  </div>
);

// Wireframe Product Card
const ProductCardWireframe = () => (
  <div className="border-2 border-dashed border-neutral-300 p-4 space-y-3">
    {/* Product Image Placeholder */}
    <Placeholder label="Product Image" height="h-32" className="rounded" />

    {/* Brand */}
    <Placeholder label="Brand" width="w-16" height="h-3" />

    {/* Product Name + Badge */}
    <div className="flex items-center gap-2">
      <Placeholder label="Product Name" width="w-32" height="h-5" />
      <Placeholder label="Gap" width="w-12" height="h-5" className="rounded-full" />
    </div>

    {/* SKU */}
    <Placeholder label="SKU Number" width="w-28" height="h-3" />

    {/* Tags */}
    <div className="flex gap-2">
      <Placeholder label="Type" width="w-14" height="h-6" className="rounded-full" />
      <Placeholder label="THC %" width="w-16" height="h-6" className="rounded-full" />
    </div>

    {/* Markets */}
    <div className="flex items-center gap-2">
      <Placeholder label="Markets" width="w-14" height="h-4" />
      <div className="flex gap-1">
        <Placeholder label="CA" width="w-6" height="h-6" className="rounded" />
        <Placeholder label="NV" width="w-6" height="h-6" className="rounded" />
        <Placeholder label="NV" width="w-6" height="h-6" className="rounded" />
        <Placeholder label="CO" width="w-6" height="h-6" className="rounded" />
      </div>
      <Placeholder label="3/4" width="w-16" height="h-4" />
    </div>
  </div>
);

// Wireframe Sidebar
const SidebarWireframe = () => (
  <div className="w-56 border-r-2 border-dashed border-neutral-300 p-4 space-y-6 h-full">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <Placeholder label="Logo" width="w-8" height="h-8" />
      <div className="space-y-1">
        <Placeholder label="GCR" width="w-12" height="h-4" />
        <Placeholder label="Subtitle" width="w-24" height="h-3" />
      </div>
    </div>

    {/* Nav Items */}
    <div className="space-y-2">
      <Placeholder label="Home" height="h-10" className="rounded" />
      <Placeholder label="Products (active)" height="h-10" className="rounded bg-neutral-300" />
      <Placeholder label="Bundles" height="h-10" className="rounded" />
      <Placeholder label="Integrations" height="h-10" className="rounded" />
    </div>

    {/* Spacer */}
    <div className="flex-1" />

    {/* Admin Section */}
    <div className="space-y-2 pt-4 border-t-2 border-dashed border-neutral-300">
      <Placeholder label="Admin" height="h-10" className="rounded" />
      <div className="pl-4 space-y-2">
        <Placeholder label="Employees" height="h-8" className="rounded" />
        <Placeholder label="Settings" height="h-8" className="rounded" />
      </div>
    </div>

    {/* Logout */}
    <Placeholder label="Logout" height="h-10" className="rounded" />
  </div>
);

// Wireframe Header
const HeaderWireframe = () => (
  <div className="h-16 border-b-2 border-dashed border-neutral-300 px-6 flex items-center justify-between">
    {/* Left: Menu icons */}
    <div className="flex items-center gap-3">
      <Placeholder label="Menu" width="w-8" height="h-8" />
      <Placeholder label="Grid" width="w-8" height="h-8" />
      <Placeholder label="Logo" width="w-8" height="h-8" />
      <Placeholder label="GCR" width="w-32" height="h-4" />
    </div>

    {/* Center: Search */}
    <Placeholder label="Search: Find or ask about a product..." width="w-96" height="h-10" className="rounded-full" />

    {/* Right: Actions */}
    <div className="flex items-center gap-3">
      <Placeholder label="Bell" width="w-8" height="h-8" className="rounded-full" />
      <Placeholder label="Help" width="w-8" height="h-8" className="rounded-full" />
      <Placeholder label="ON" width="w-8" height="h-8" className="rounded-full" />
      <div className="space-y-1">
        <Placeholder label="Org Name" width="w-24" height="h-4" />
        <Placeholder label="Organization" width="w-20" height="h-3" />
      </div>
    </div>
  </div>
);

// Wireframe Pagination
const PaginationWireframe = () => (
  <div className="flex items-center justify-end gap-4 py-4">
    <Placeholder label="80-90 of 90" width="w-20" height="h-4" />
    <Placeholder label="10 per page" width="w-24" height="h-8" className="rounded" />
    <Placeholder label="Page 9 of 9" width="w-24" height="h-8" className="rounded" />
    <div className="flex gap-1">
      <Placeholder label="|<" width="w-8" height="h-8" className="rounded" />
      <Placeholder label="<" width="w-8" height="h-8" className="rounded" />
      <Placeholder label=">" width="w-8" height="h-8" className="rounded" />
      <Placeholder label=">|" width="w-8" height="h-8" className="rounded" />
    </div>
  </div>
);

// Main Page Component
export function ProductsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <HeaderWireframe />

      <div className="flex flex-1">
        {/* Sidebar */}
        <SidebarWireframe />

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Title */}
          <div className="space-y-2">
            <Placeholder label="Products" width="w-48" height="h-10" />
            <Placeholder label="Browse Metrc-verified applications..." width="w-96" height="h-4" />
          </div>

          {/* Product Stats Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Placeholder label="Product stats" width="w-28" height="h-5" />
              <Placeholder label="Edit" width="w-6" height="h-6" />
            </div>
            <div className="flex gap-4">
              <StatsCardWireframe label="Total products" />
              <StatsCardWireframe label="Total bundles" />
              <StatsCardWireframe label="Drafts" />
              <StatsCardWireframe label="Active" />
            </div>
          </div>

          {/* Tabs + Actions Row */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-6">
              <Placeholder label="All products" width="w-24" height="h-8" className="border-b-2 border-neutral-400" />
              <Placeholder label="Markets" width="w-20" height="h-8" />
              <Placeholder label="Brands" width="w-16" height="h-8" />
            </div>
            <Placeholder label="+ Register new product" width="w-44" height="h-10" className="rounded-full bg-neutral-300" />
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between">
            <Placeholder label="Select mode" width="w-28" height="h-10" className="rounded" />
            <div className="flex gap-2">
              <Placeholder label="Sort" width="w-8" height="h-8" />
              <Placeholder label="Grid" width="w-8" height="h-8" />
              <Placeholder label="List" width="w-8" height="h-8" />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 gap-4">
            <ProductCardWireframe />
            <ProductCardWireframe />
            <ProductCardWireframe />
            <ProductCardWireframe />
            <ProductCardWireframe />
            <ProductCardWireframe />
          </div>

          {/* Pagination */}
          <PaginationWireframe />
        </main>
      </div>
    </div>
  );
}

// Navigation connections
export const screenFlow = {
  previous: null,
  next: 'ProductDetail',
  alternates: ['Bundles', 'Integrations', 'Settings'],
};

export default ProductsPage;
