import {useEffect, useRef, useState, type ReactNode} from "react";
import {NavLink, Link, useLocation} from "react-router-dom";
import "./site-shell.css";

const navigation = [
    {label: "About", to: "/about"},
    {label: "Gallery", to: "/gallery"},
    {label: "OC", to: "/lore"},
    {label: "Projects", to: "/projects"},
];

function DestinationLinks({className, onNavigate}: Readonly<{className: string; onNavigate?: () => void}>) {
    return <nav className={className} aria-label="Primary navigation">
        {navigation.map(destination =>
            <NavLink
                to={destination.to}
                key={destination.to}
                onClick={onNavigate}
                className="site-nav-link"
            >
                {destination.label}
            </NavLink>
        )}
    </nav>;
}

export function SiteShell({children}: Readonly<{children: ReactNode}>) {
    const location = useLocation();
    const menuRef = useRef<HTMLDetailsElement>(null);
    const isHome = location.pathname === "/";

    const headerRef = useRef<HTMLElement>(null);
    const [heroTitle, setHeroTitle] = useState<string | null>(null);
    const [isHeroTitleHidden, setIsHeroTitleHidden] = useState(false);
    const closeMenu = () => menuRef.current?.removeAttribute("open");

    // New page: close the mobile menu and start at the top (e.g. after following the footer's Privacy Policy link).
    // Keyed on pathname only, so the gallery's ?artwork= modal opens and closes without jumping.
    useEffect(() => {
        menuRef.current?.removeAttribute("open");
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Repeat the page title next to the wordmark once the hero heading scrolls behind the bar.
    useEffect(() => {
        let frame = 0;
        const update = () => {
            const hero = document.querySelector<HTMLElement>("[data-site-hero]");
            const title = hero?.querySelector("h1");
            const header = headerRef.current;
            const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
            setHeroTitle(title?.textContent ?? null);
            setIsHeroTitleHidden(!!title && !!header && title.getBoundingClientRect().bottom <= headerBottom);
        };
        const schedule = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", schedule, {passive: true});
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [location.pathname]);

    return <div className={isHome ? "site-shell site-shell-home" : "site-shell"}>
        <header className="site-header" ref={headerRef}>
            <div className="site-header-bar">
                <div className="site-header-identity">
                    <Link className="site-wordmark" to="/" onClick={closeMenu} aria-label="Kaze home">Kaze</Link>
                    {heroTitle && <span className={isHeroTitleHidden ? "site-header-title is-visible" : "site-header-title"} aria-hidden="true">
                        <span className="site-header-title-text">{heroTitle}</span>
                    </span>}
                </div>
                <DestinationLinks className="site-nav"/>
                <details
                    className="site-mobile-menu"
                    ref={menuRef}
                    onKeyDown={event => {
                        if (event.key === "Escape" && event.currentTarget.open) {
                            event.preventDefault();
                            closeMenu();
                            event.currentTarget.querySelector("summary")?.focus();
                        }
                    }}
                >
                    <summary>Menu</summary>
                    <DestinationLinks className="site-mobile-destinations" onNavigate={closeMenu}/>
                </details>
            </div>
        </header>

        <main className={`site-main site-frame${isHome ? " site-main-home" : " site-main-route"}`}>
            {children}
        </main>

        {!isHome && <footer className="site-footer site-frame">
            <p>© {new Date().getFullYear()} Kazeous Production - <Link to="/privacy-policy">Privacy Policy</Link></p>
        </footer>}
    </div>;
}
