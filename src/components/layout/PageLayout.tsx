import type { ReactNode } from "react";
export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#catalog">
        Skip to library
      </a>
      <div className="page-shell" id="home">
        <header className="site-header">
          <a className="brand" href="#home" aria-label="Respawn Shop home">
            respawn<span className="brand-dot">/</span>
            <span className="brand-shop">shop</span>
          </a>
          <span className="header-note">DIGITAL PC GAMES</span>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>
            Non-commercial demo · No official affiliation.
            <br />
            Game artwork and trademarks belong to their respective owners.
          </p>
        </footer>
      </div>
    </>
  );
}
