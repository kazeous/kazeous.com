import {useDocumentTitle} from "usehooks-ts";
import {AboutSubnavigation} from "./AboutSubnavigation.tsx";
import {Outlet} from "react-router";
import {PageHero} from "../../layout/PageHero.tsx";
import {heroImage} from "./aboutProfile";
import './about.css'

export function AboutRoot() {
    useDocumentTitle("About Me - kazeous.com");
    return <div className="about-layout">
        <PageHero title="About" kicker="Profile" variant="about" image={heroImage} wide/>
        <div className="page-body page-body-wide">
            <AboutSubnavigation/>
            <div className="about-content">
                <Outlet/>
            </div>
        </div>
    </div>;
}
