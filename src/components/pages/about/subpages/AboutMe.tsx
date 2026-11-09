import type {PointerEvent, ReactNode} from "react";
import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAt,
    faBullseye,
    faGamepad,
    faLaptop,
    faPalette,
    faQuoteLeft,
    faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import avatar from "../../../../assets/kaze-avatar.png";
import {socialLinks} from "../../../layout/socialLinkData";
import {SectionHeading} from "../../../layout/SectionHeading.tsx";
import {
    characterDetails,
    characterDetailsSubtitle,
    devices,
    gaming,
    hobbies,
    hobbiesNote,
    nextSteps,
    nextStepsNote,
    profile,
    quotes,
    type Entry,
} from "../aboutProfile";

/* Spawns a ripple inside the innermost card or tile under the pointer. */
function spawnRipple(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const host = (event.target as HTMLElement).closest<HTMLElement>(".about-tile, .about-card");
    if (!host || !event.currentTarget.contains(host)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = host.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const ripple = document.createElement("span");
    ripple.className = "about-ripple";
    ripple.setAttribute("aria-hidden", "true");
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    host.appendChild(ripple);

    const remove = () => ripple.remove();
    ripple.addEventListener("animationend", remove, {once: true});
    window.setTimeout(remove, 1800);
}

function AboutCard({className, icon, title, subtitle, children}: Readonly<{
    className: string;
    icon: IconDefinition;
    title: string;
    subtitle: string;
    children: ReactNode;
}>) {
    return <section className={`about-card ${className}`} aria-label={title}>
        <div className="about-card-head">
            <span className="about-card-icon"><FontAwesomeIcon icon={icon} aria-hidden="true"/></span>
            <div>
                <h3>{title}</h3>
                <p>{subtitle}</p>
            </div>
        </div>
        {children}
    </section>;
}

function Tile({label, value, href, icon}: Readonly<Entry & {icon?: IconDefinition}>) {
    const body = <>
        {icon && <span className="about-tile-icon"><FontAwesomeIcon icon={icon} aria-hidden="true"/></span>}
        <span className="about-tile-text">
            <span className="about-tile-label">{label}</span>
            {value && <span className="about-tile-value">{value}</span>}
        </span>
        {href && <span className="about-tile-arrow" aria-hidden="true">↗</span>}
    </>;
    return href
        ? <a className="about-tile is-link" href={href} target="_blank" rel="noreferrer">{body}</a>
        : <div className="about-tile">{body}</div>;
}

export function AboutMe() {
    return <div className="about-page fade" onPointerDown={spawnRipple}>
        <SectionHeading title="Introduction" kicker="About me"/>

        <div className="about-bento">
            <section className="about-card about-profile about-span-8" aria-label="Profile">
                <img className="about-avatar" src={avatar} alt="Illustrated portrait of Kaze waving"/>
                <div className="about-profile-copy">
                    <h3 className="about-name">{profile.name}</h3>
                    <p className="about-tagline">{profile.tagline}</p>
                    <dl className="about-facts">
                        {profile.facts.map(fact =>
                            <div className="about-fact" key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd>{fact.value}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            </section>

            <section className="about-card about-quotes about-span-4" aria-label="Quotes">
                <span className="about-card-icon"><FontAwesomeIcon icon={faQuoteLeft} aria-hidden="true"/></span>
                {quotes.map(quote =>
                    <figure className="about-quote" key={quote.text}>
                        <blockquote>“{quote.text}”</blockquote>
                        <figcaption>{quote.source}</figcaption>
                    </figure>
                )}
            </section>

            <AboutCard className="about-span-5" icon={faWandMagicSparkles} title="Character Details" subtitle={characterDetailsSubtitle}>
                <div className="about-tiles">
                    {characterDetails.map(entry => <Tile key={entry.label} {...entry}/>)}
                </div>
            </AboutCard>

            <AboutCard className="about-span-7" icon={faAt} title="Social" subtitle="Find me">
                <div className="about-tiles about-tiles-3">
                    {socialLinks.map(social =>
                        <Tile key={social.label} label={social.label} value={social.handle} href={social.href}/>
                    )}
                </div>
            </AboutCard>

            <AboutCard className="about-span-6" icon={faGamepad} title="Gaming" subtitle="Play">
                <div className="about-tiles">
                    {gaming.map(entry => <Tile key={entry.label} {...entry}/>)}
                </div>
            </AboutCard>

            <AboutCard className="about-span-6" icon={faLaptop} title="Devices" subtitle="Setup">
                <div className="about-tiles about-tiles-2">
                    {devices.map(device => <Tile key={device.label} {...device}/>)}
                </div>
            </AboutCard>

            {/* With only a note to show, Hobbies and Next Steps sit side by side instead of as two thin full-width rows. */}
            <AboutCard className={hobbies.length > 0 ? "about-span-12" : "about-span-6"} icon={faPalette} title="Hobbies" subtitle="Hobbies">
                {hobbies.length === 0 && <p className="about-note">{hobbiesNote}</p>}
                {hobbies.length > 0 && <div className="about-skill-groups">
                    {hobbies.map(group =>
                        <div className="about-skill-group" key={group.title}>
                            <h4>{group.title}</h4>
                            {group.items.map(item =>
                                <div className="about-skill" key={item.label}>
                                    <div className="about-skill-row">
                                        <span>{item.label}</span>
                                        <span>{item.level}%</span>
                                    </div>
                                    <div
                                        className="about-bar"
                                        role="meter"
                                        aria-label={item.label}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={item.level}
                                    >
                                        <span style={{width: `${item.level}%`}}/>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>}
            </AboutCard>

            <AboutCard className={nextSteps.length > 0 ? "about-span-12" : "about-span-6"} icon={faBullseye} title="Next Steps" subtitle="Next steps">
                {nextSteps.length === 0 && <p className="about-note">{nextStepsNote}</p>}
                {nextSteps.length > 0 && <div className="about-tiles about-tiles-4">
                    {nextSteps.map(step => <Tile key={step.label} {...step}/>)}
                </div>}
            </AboutCard>
        </div>
    </div>;
}
