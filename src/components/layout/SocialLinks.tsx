import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {socialLinks} from "./socialLinkData";

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
