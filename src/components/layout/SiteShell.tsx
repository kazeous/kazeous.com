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
                className={({isActive}) => isActive ? "site-nav-link is-active" : "site-nav-link"}
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
    const [isOverHero, setIsOverHero] = useState(false);
    const [heroTitle, setHeroTitle] = useState<string | null>(null);
    const [isHeroTitleHidden, setIsHeroTitleHidden] = useState(false);

    // New page: close the mobile menu and start at the top (e.g. after following the footer's Privacy Policy link).
    // Keyed on pathname only, so the gallery's ?artwork= modal opens and closes without jumping.
    useEffect(() => {
        menuRef.current?.removeAttribute("open");
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // A page hero ([data-site-hero]) under the glass header switches the header to light-on-dark,
    // and once the hero's <h1> has scrolled up behind the header, a compact copy slides out next to KAZE.
    useEffect(() => {
        let frame = 0;
        const update = () => {
            const hero = document.querySelector<HTMLElement>("[data-site-hero]");
            const title = hero?.querySelector("h1");
            const header = headerRef.current;
            const headerBottom = header?.offsetHeight ?? 0;
            setIsOverHero(!!hero && !!header && hero.getBoundingClientRect().bottom > headerBottom);
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
        <header className={isOverHero ? "site-header is-over-hero" : "site-header"} ref={headerRef}>
            <div className="site-header-bar site-frame">
                <Link className="site-wordmark" to="/" aria-label="Kaze home">Kaze</Link>
                {/* Decorative repeat of the page's <h1>, so it stays hidden from assistive tech. */}
                {heroTitle && <span className={isHeroTitleHidden ? "site-header-title is-visible" : "site-header-title"} aria-hidden="true">
                    <span className="site-header-title-text">{heroTitle}</span>
                </span>}
                <DestinationLinks className="site-nav"/>
                <details className="site-mobile-menu" ref={menuRef}>
                    <summary>Menu</summary>
                    <DestinationLinks
                        className="site-mobile-destinations"
                        onNavigate={() => menuRef.current?.removeAttribute("open")}
                    />
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
