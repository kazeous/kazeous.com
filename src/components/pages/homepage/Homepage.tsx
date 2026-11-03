import {useDocumentTitle} from "usehooks-ts";
import avatar from "../../../assets/kaze-avatar.png";
import {SocialLinks} from "../../layout/SocialLinks";
import {DotField} from "./DotField";
import "./homepage.css";

export function Homepage() {
    useDocumentTitle("kazeous.com");
    return <section className="home-hero" aria-labelledby="home-name">
        <DotField/>
        <div className="home-profile">
            <img className="home-avatar" src={avatar} alt="Illustrated portrait of Kaze waving"/>
            <div className="home-bio">
                <h1 id="home-name">Kaze</h1>
                <p>A dragon-shark wandering on a path.</p>
                <p className="home-aside">amateur at everything!</p>
                <SocialLinks className="home-social"/>
            </div>
        </div>
    </section>;
}
