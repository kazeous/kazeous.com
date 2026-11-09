import {Navigate, useParams} from "react-router-dom";

/** Old `/gallery/:id` detail links now open the artwork's modal on the gallery page. */
export function ArtworkRedirect() {
    const {id = ""} = useParams();
    return <Navigate replace to={{pathname: "/gallery", search: `?artwork=${encodeURIComponent(id)}`}}/>;
}
