import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBluesky, faGithub, faTwitch, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faBlog} from "@fortawesome/free-solid-svg-icons/faBlog";

const socialLinks = [
    {label: "Blog", href: "https://blog.kazeous.com", icon: faBlog},
    {label: "GitHub", href: "https://github.com/kazeous", icon: faGithub},
    {label: "Twitter", href: "https://twitter.com/kaze_ous", icon: faTwitter},
    {label: "Twitch", href: "https://www.twitch.tv/kazeous", icon: faTwitch},
    {label: "Bluesky", href: "https://bsky.app/profile/kazeous.bsky.social", icon: faBluesky},
];

export function SocialLinks({className}: {className: string}) {
    return <nav className={className} aria-label="Social links">
        {socialLinks.map(social =>
            <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
            >
                <FontAwesomeIcon icon={social.icon} aria-hidden="true"/>
            </a>
        )}
    </nav>;
}
