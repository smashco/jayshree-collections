'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Warehouse,
  Truck,
  BarChart3,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Shipping', href: '/admin/shipping', icon: Truck },
  { label: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-[#BFA06A]/10 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="p-6 border-b border-[#BFA06A]/10">
        <Link href="/admin" className="block">
          <h1 className="font-cormorant text-white text-xl font-medium tracking-[0.2em]">
            JAYSHREE
          </h1>
          <p className="font-montserrat text-[#BFA06A]/60 text-[0.55rem] tracking-[0.4em] uppercase mt-1">
            Admin Panel
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded font-montserrat text-sm tracking-wide transition-colors
                ${isActive
                  ? 'bg-[#BFA06A]/10 text-[#BFA06A] font-medium'
                  : 'text-[#F0E6C2]/60 hover:text-[#F0E6C2] hover:bg-white/5'
                }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#BFA06A]/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-[#F0E6C2]/40 hover:text-[#F0E6C2]/70 font-montserrat text-xs tracking-wide transition-colors mb-2"
        >
          View Store →
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin-login' })}
          className="flex items-center gap-3 px-4 py-2 text-[#F0E6C2]/40 hover:text-red-400 font-montserrat text-xs tracking-wide transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
