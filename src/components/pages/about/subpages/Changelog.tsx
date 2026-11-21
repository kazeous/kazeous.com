import {Container} from "../../../ui/Container.tsx";

export function Changelog() {
    const entries = [
        {
            title: "November 2026 Update",
            date: "2026-11-21",
            displayDate: "Nov 21, 2026",
            changes: [
                "Migrated artwork hosting and uploads from Amazon S3 to Cloudflare R2, and updated catalog URLs for original images and WebP variants.",
                "Rebuilt the Gallery around separate sticker and commission grids. Added shareable artwork dialogs, alternate versions, and a full-screen viewer with zoom, pan, and rotation. Existing artwork links redirect to the new dialogs.",
                "Added floating site navigation with a compact mobile menu, and introduced shared page layouts across About Me, Gallery, Projects, and Lore.",
                "Reworked the homepage around a compact profile and an interactive PixiJS background that respects reduced-motion settings.",
                "Added featured cards for Cyfurden and Pawket, linked the studio status page, and removed duplicate featured projects from the GitHub repository list.",
                "Added a dedicated Privacy Policy page."
            ]
        },
        {
            title: "2.0",
            date: "2026-08-10",
            displayDate: "08/10/2026",
            description: "UI/UX redesign."
        },
    ]
    return <Container className={"fade"}>
        <h2 className={"primary-text"}>Changelog</h2>
        <ul className={"list border changelog-entries"}>
            {entries.map(value => <li key={value.title}>
                <div>
                    <h3>{value.title}</h3>
                    <time dateTime={value.date}>{value.displayDate}</time>
                    {value.changes ? <ul className="changelog-changes">
                        {value.changes.map(change => <li key={change}>{change}</li>)}
                    </ul> : <p>{value.description}</p>}
                </div>
            </li>)}
        </ul>
    </Container>;
}
