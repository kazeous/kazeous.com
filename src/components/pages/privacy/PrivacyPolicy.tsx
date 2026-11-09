import type {ReactNode} from "react";
import {Link} from "react-router-dom";
import {useDocumentTitle} from "usehooks-ts";
import {PageHero} from "../../layout/PageHero.tsx";
import {socialLinks} from "../../layout/socialLinkData.ts";
import "./privacy.css";

const LAST_UPDATED = {iso: "2026-11-09", label: "November 9, 2026"};

function ExternalLink({href, children}: Readonly<{href: string; children: ReactNode}>) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

// Email, then the site-wide Bluesky and Twitter links (socialLinkData.ts) so handles never drift apart.
const contactLinks = [
    {label: "Email", handle: "hishou@kazeous.com", href: "mailto:hishou@kazeous.com"},
    ...["Bluesky", "Twitter"].flatMap(label => socialLinks.filter(link => link.label === label)),
];

/*
 * Written for what kazeous.com actually does: a static site on Cloudflare with no accounts, forms,
 * comments, cookies, local storage or analytics. Update it whenever a feature changes that.
 */
const sections: {id: string; title: string; body: ReactNode}[] = [
    {
        id: "scope",
        title: "Scope",
        body: <>
            <p>
                This policy covers kazeous.com and every page on it: the home page, About, Gallery, OC and Projects.
                It explains what information is involved when you browse the site and what happens to it.
            </p>
            <p>
                It does not cover other websites you reach through links here, such as VGen, GitHub, social media
                profiles or artists' own pages. Those services have their own privacy policies.
            </p>
        </>,
    },
    {
        id: "information",
        title: "Information involved when you visit",
        body: <>
            <p>
                This site has no accounts, sign-up, comment boxes, contact forms or guestbook, so it never asks you
                to type in personal information.
            </p>
            <p>
                Like any website, loading a page means your browser sends a request to the server. The hosting
                provider handles that request and may process standard technical details such as:
            </p>
            <ul>
                <li>your IP address;</li>
                <li>the date and time of the request and the page or file requested;</li>
                <li>your browser, device type and operating system (the user agent);</li>
                <li>the page that linked you here (the referrer).</li>
            </ul>
        </>,
    },
    {
        id: "use",
        title: "How that information is used",
        body: <>
            <p>Technical request details are used only to:</p>
            <ul>
                <li>deliver pages, images and other files to your browser;</li>
                <li>keep the site secure and protect it from abuse or attacks;</li>
                <li>diagnose errors and keep the site running.</li>
            </ul>
            <p>
                The site runs no analytics, advertising or cross-site tracking scripts, builds no profiles of visitors,
                and never sells or rents information about anyone.
            </p>
        </>,
    },
    {
        id: "cookies",
        title: "Cookies and local storage",
        body: <>
            <p>
                The site's own code does not set cookies and does not store anything in your browser's local storage
                or session storage.
            </p>
            <p>
                The hosting provider may set a strictly necessary security cookie, for example to tell people apart from
                automated bots during an attack. Such a cookie is not used for advertising or tracking. Your browser may
                also cache files to load pages faster; you can clear or block cookies and cache in your browser settings
                and the site will keep working.
            </p>
        </>,
    },
    {
        id: "third-parties",
        title: "Third-party services",
        body: <>
            <p>
                Some parts of the site are delivered by other companies. When your browser loads them, that company
                receives the technical details needed to complete the request (such as your IP address and user agent)
                and handles them under its own privacy policy:
            </p>
            <ul>
                <li>
                    <strong>Cloudflare</strong> hosts the site and serves its pages (<ExternalLink href="https://www.cloudflare.com/privacypolicy/">privacy policy</ExternalLink>).
                </li>
                <li>
                    <strong>Amazon Web Services (S3)</strong> stores and serves the artwork images in the Gallery
                    (<ExternalLink href="https://aws.amazon.com/privacy/">privacy notice</ExternalLink>).
                </li>
                <li>
                    <strong>jsDelivr</strong> delivers some of the site's stylesheets and scripts
                    (<ExternalLink href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net">privacy policy</ExternalLink>).
                </li>
                <li>
                    <strong>GitHub</strong>: the Projects page asks GitHub's public API for the list of repositories, so
                    your browser contacts GitHub directly when you open that page
                    (<ExternalLink href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">privacy statement</ExternalLink>).
                </li>
            </ul>
            <p>
                Links to VGen, social media, artists' pages and other sites only take effect if you click them; what
                happens after that is governed by the site you visit.
            </p>
        </>,
    },
    {
        id: "sharing",
        title: "Sharing and disclosure",
        body: <>
            <p>Information about visitors is not shared with anyone except:</p>
            <ul>
                <li>the service providers listed above, to the extent they need it to deliver the site;</li>
                <li>where the law, a court or a competent authority requires it;</li>
                <li>where it is necessary to investigate abuse or protect the site, its visitors or others.</li>
            </ul>
        </>,
    },
    {
        id: "retention",
        title: "How long information is kept",
        body: <>
            <p>
                The site itself keeps no database of visitors. Request logs and security records held by the providers
                above are kept for as long as each provider's policy describes, typically a limited period for security
                and troubleshooting.
            </p>
        </>,
    },
    {
        id: "security",
        title: "Security",
        body: <>
            <p>
                Pages are served over an encrypted HTTPS connection, and because the site does not collect personal
                details there is very little to protect in the first place. No method of transmission or storage is
                perfectly secure, though, so please don't send sensitive information through public channels.
            </p>
        </>,
    },
    {
        id: "rights",
        title: "Your rights",
        body: <>
            <p>
                Depending on where you live, you may have the right to ask what personal information is held about you,
                and to have it corrected or deleted. Since this site does not keep personal information about visitors,
                there is usually nothing to access or remove here.
            </p>
            <p>
                For data handled by one of the providers above, contact that provider directly. If you have any question
                about this site specifically, get in touch using the details below.
            </p>
        </>,
    },
    {
        id: "children",
        title: "Children's privacy",
        body: <>
            <p>
                The site is not directed at children under 13 and does not knowingly collect personal information from
                anyone. If you believe a child has sent personal information here, please get in touch and it will be
                removed.
            </p>
        </>,
    },
    {
        id: "changes",
        title: "Changes to this policy",
        body: <>
            <p>
                This policy will be updated when the site changes in a way that affects your privacy, for example if a
                new feature starts collecting information. The date at the top of this page shows when it last changed.
            </p>
        </>,
    },
    {
        id: "contact",
        title: "Contact",
        body: <>
            <p>Questions about this policy can be sent to Kazeous Production through:</p>
            <ul>
                {contactLinks.map(link => <li key={link.label}>
                    <strong>{link.label}</strong>: {link.href.startsWith("mailto:")
                        ? <a href={link.href}>{link.handle}</a>
                        : <ExternalLink href={link.href}>{link.handle}</ExternalLink>}
                </li>)}
            </ul>
            <p>More ways to reach out are on the <Link to="/about">About</Link> page.</p>
        </>,
    },
];

const toSectionId = (id: string) => `privacy-${id}`;

/** HashRouter owns the URL hash, so the table of contents scrolls in place instead of using #anchors. */
function scrollToSection(id: string) {
    const target = document.getElementById(toSectionId(id));
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "start"});
    target.focus({preventScroll: true});
}

export function PrivacyPolicy() {
    useDocumentTitle("Privacy Policy - kazeous.com");

    return <div className="privacy-page fade">
        <PageHero
            title="Privacy Policy"
            kicker="Legal"
            description="What happens to your information when you visit kazeous.com."
            variant="privacy"
            wide
        />
        <div className="page-body page-body-wide privacy-layout">
            {/* role="navigation" on a div: BeerCSS restyles every <nav> as a flex toolbar. */}
            <div className="privacy-toc" role="navigation" aria-label="Privacy policy sections">
                <p className="privacy-toc-title">Contents</p>
                <ol>
                    {sections.map((section, index) =>
                        <li key={section.id}>
                            <button type="button" onClick={() => scrollToSection(section.id)}>
                                <span className="privacy-toc-number">{String(index + 1).padStart(2, "0")}</span>
                                {section.title}
                            </button>
                        </li>
                    )}
                </ol>
            </div>

            <article className="privacy-content">
                <div className="privacy-intro">
                    <p className="privacy-updated">
                        Last updated <time dateTime={LAST_UPDATED.iso}>{LAST_UPDATED.label}</time>
                    </p>
                    <p>
                        kazeous.com is a personal portfolio run by Kazeous Production. It is built to need as little of your
                        information as possible: there are no accounts, forms or tracking. This page explains the small
                        amount of technical information that is still involved when you visit.
                    </p>
                </div>

                {sections.map((section, index) =>
                    <section className="privacy-section" key={section.id} id={toSectionId(section.id)} tabIndex={-1} aria-labelledby={`${toSectionId(section.id)}-title`}>
                        <h2 id={`${toSectionId(section.id)}-title`}>
                            <span className="privacy-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            {section.title}
                        </h2>
                        {section.body}
                    </section>
                )}
            </article>
        </div>
    </div>;
}
