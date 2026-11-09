import {useLocation} from "react-router";
import {clsx} from "clsx";
import {Link} from "react-router-dom";
import {aboutSubRoutes} from "./aboutRoutes.tsx";

function LinkButton(props: Readonly<{ path: string, name: string, isActive: boolean }>) {
    return <Link to={`${props.path}`} className={clsx("about-subnav-link", props.isActive && "is-active")}>
        {props.name}
    </Link>;
}

export function AboutSubnavigation() {
    const location = useLocation();
    const currentSubroute = (new RegExp(/^\/about\/?(.*)/).exec(location.pathname) ?? ['/about', ''])[1];
    return <nav className="about-subnav" aria-label="About sections">
        {[{path: '', name: 'Me IRL'}].concat(aboutSubRoutes).map(value =>
            <LinkButton key={value.name} name={value.name} path={value.path} isActive={currentSubroute === value.path}/>
        )}
    </nav>;
}
