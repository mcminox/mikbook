import Link from "next/link";
import type { ReactNode } from "react";

export function OriginalSiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="original-site">
      <header className="original-site__header">
        <Link className="original-site__brand" href="/original">
          MIKBOOK
        </Link>
        <details className="original-site__menu">
          <summary>MENU</summary>
          <nav aria-label="Main menu">
            <Link href="/original#chapitres">CHAPITRES</Link>
            <Link href="/original/games">GAMES</Link>
            <Link href="/original/serious-games">SERIOUS GAMES</Link>
            <Link href="/original/videos">VIDEOS</Link>
            <Link href="/original/collection">COLLECTION</Link>
          </nav>
        </details>
      </header>
      {children}
    </div>
  );
}
