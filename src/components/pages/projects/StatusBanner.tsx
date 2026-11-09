import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {STATUS_PAGE_URL} from "./projects.ts";

/**
 * Link out to the studio's status page. The dot is the accent colour, not green: this page never checks
 * whether the services are actually up, so it must not look like a live "all systems operational" light.
 */
export function StatusBanner() {
    if (!STATUS_PAGE_URL) {
        return null;
    }

    return <a className="status-banner" href={STATUS_PAGE_URL} target="_blank" rel="noopener noreferrer">
        <span className="status-banner-dot" aria-hidden="true"/>
        <span className="status-banner-copy">
            <span className="status-banner-title">Server &amp; studio status</span>
            <span className="status-banner-text">Check whether the studio's servers and services are up.</span>
        </span>
        <FontAwesomeIcon className="status-banner-icon" icon={faArrowUpRightFromSquare} aria-hidden="true"/>
    </a>;
}
