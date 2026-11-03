import {useEffect, useRef, type ReactNode} from "react";
import {NavLink, Link, useLocation} from "react-router-dom";
import {SocialLinks} from "./SocialLinks";
import "./site-shell.css";

const navigation = [
    {label: "Gallery", to: "/gallery"},
    {label: "Projects", to: "/projects"},
    {label: "Characters", to: "/lore"},
    {label: "About", to: "/about"},
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
                <span>{destination.label}</span>
                <span aria-hidden="true">↗</span>
            </NavLink>
        )}
    </nav>;
}

export function SiteShell({children}: Readonly<{children: ReactNode}>) {
    const location = useLocation();
    const menuRef = useRef<HTMLDetailsElement>(null);
    const isHome = location.pathname === "/";

    useEffect(() => {
        menuRef.current?.removeAttribute("open");
    }, [location.pathname]);

    return <div className={isHome ? "site-shell site-shell-home" : "site-shell"}>
        <header className="site-header">
            {!isHome && <div className="site-header-top site-frame">
                <Link className="site-wordmark" to="/" aria-label="Kaze home">Kaze</Link>
                <p className="site-discipline">A dragon-shark wandering on a path.</p>
                <SocialLinks className="site-social-links"/>
                <details className="site-mobile-menu" ref={menuRef}>
                    <summary>Menu</summary>
                    <DestinationLinks
                        className="site-mobile-destinations"
                        onNavigate={() => menuRef.current?.removeAttribute("open")}
                    />
                </details>
            </div>}
            <DestinationLinks className="site-nav site-frame"/>
        </header>

        <main className={`site-main site-frame${isHome ? " site-main-home" : " site-main-route"}`}>
            {children}
        </main>

        {!isHome && <footer className="site-footer site-frame">
            <p>© {new Date().getFullYear()} Kazeous</p>
        </footer>}
    </div>;
}
