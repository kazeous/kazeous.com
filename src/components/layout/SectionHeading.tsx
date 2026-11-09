import type {ReactNode} from "react";
import "./page-sections.css";

export function SectionHeading({title, kicker, id, action}: Readonly<{
    title: string;
    kicker: string;
    id?: string;
    /** Optional control shown at the right end of the heading row, e.g. an external link. */
    action?: ReactNode;
}>) {
    return <div className="page-section-heading">
        <div>
            <h2 id={id}>{title}</h2>
            <p className="page-kicker">{kicker}</p>
        </div>
        {action}
    </div>;
}
