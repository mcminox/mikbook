import type { ReactNode } from "react";

export function OriginalSubpage({
  title,
  children,
}: {
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <main className="original-subpage">
      <h1 className="original-subpage__title">{title}</h1>
      {children && <div className="original-subpage__body">{children}</div>}
    </main>
  );
}
