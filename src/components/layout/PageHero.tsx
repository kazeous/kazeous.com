import "./page-sections.css";

/**
 * Full-bleed banner that slides under the glass header. `data-site-hero` tells SiteShell to switch
 * the header to light-on-dark while the banner is underneath it.
 */
export function PageHero({title, kicker, variant, description, image, wide = false}: Readonly<{
    title: string;
    kicker: string;
    variant: "about" | "gallery" | "oc" | "projects" | "privacy";
    description?: string;
    image?: string;
    /** Align the title with the full navbar frame (pair with `page-body-wide`) instead of the 72rem column. */
    wide?: boolean;
}>) {
    return <div className={`page-hero page-hero-${variant}${wide ? " page-hero-wide" : ""}`} data-site-hero="">
        {image && <img className="page-hero-image" src={image} alt=""/>}
        <div className="page-hero-copy">
            <h1>{title}</h1>
            <p className="page-kicker page-kicker-light">{kicker}</p>
            {description && <p className="page-hero-description">{description}</p>}
        </div>
    </div>;
}
