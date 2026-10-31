'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <Link className="logo" href="/">
        BadgeVerse
      </Link>
      <div className="nav-links">
        <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
          Home
        </Link>
        <Link
          href="/templates"
          aria-current={pathname.startsWith('/templates') ? 'page' : undefined}
        >
          Templates
        </Link>
        <Link
          href="/editor"
          aria-current={pathname.startsWith('/editor') ? 'page' : undefined}
        >
          Editor
        </Link>
        <Link
          href="/export"
          aria-current={pathname.startsWith('/export') ? 'page' : undefined}
        >
          Export
        </Link>
      </div>
    </nav>
  );
}
