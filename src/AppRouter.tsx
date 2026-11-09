import {Route, Routes} from "react-router-dom";
import {AboutRoot} from "./components/pages/about/AboutRoot.tsx";
import {AnalyticsPage} from "./components/pages/analytics/AnalyticsPage.tsx";
import {Gallery} from "./components/pages/gallery/Gallery.tsx";
import {ArtworkRedirect} from "./components/pages/gallery/Artwork.tsx";
import {OCList} from "./components/pages/lore/OCList.tsx";
import {AboutMe} from "./components/pages/about/subpages/AboutMe.tsx";
import {Projects} from "./components/pages/projects/Projects.tsx";
import {Homepage} from "./components/pages/homepage/Homepage.tsx";
import {aboutSubRoutes} from "./components/pages/about/aboutRoutes.tsx";
import {PrivacyPolicy} from "./components/pages/privacy/PrivacyPolicy.tsx";

export function AppRouter() {
    return <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/about" element={<AboutRoot/>}>
            <Route index element={<AboutMe/>}/>
            {aboutSubRoutes.map(value => <Route path={`/about/${value.path}`} element={value.element} />)}
        </Route>
        <Route path="/analytics" element={<AnalyticsPage/>}/>
        <Route path="/gallery">
            <Route index element={<Gallery/>}/>
            <Route path=":id" element={<ArtworkRedirect/>}/>
        </Route>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/lore" element={<OCList/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
    </Routes>;
}
