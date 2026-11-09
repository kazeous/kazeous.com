/*
 * Hand-picked content for the Projects page. Everything else on the page comes from the GitHub API.
 * Covers are 1200×675 screenshots of each project's site, kept in src/assets/projects.
 */
import cyfurdenCover from "../../../assets/projects/cyfurden.webp";
import pawketCover from "../../../assets/projects/pawket.webp";

/** Public status page for the studio's servers and services. Leave empty to hide the status banner. */
export const STATUS_PAGE_URL = "https://status.kazeous.com";

export type ProjectStatus = "live" | "in-development" | "archived";

export type FeaturedProject = {
    name: string;
    description: string;
    status: ProjectStatus;
    /**
     * GitHub repository as "owner/name". Adds a Repo link, shows its stars and last update when it is public,
     * and keeps it out of the "All repositories" grid so it is not listed twice.
     */
    repo?: string;
    website?: string;
    /** 16:9 cover image. Leave out to show the project's initial on a tinted panel. */
    image?: string;
    imageAlt?: string;
    tags?: string[];
};

/*
 * Shown in this order in the Featured section; an empty list hides the section. Example entry:
 *
 * {
 *     name: "Studio Bot",
 *     description: "Discord bot that runs the studio server.",
 *     status: "live",
 *     repo: "kazeous/studio-bot",
 *     website: "https://example.com",
 *     image: "https://example.com/cover.webp",
 *     imageAlt: "Studio Bot dashboard",
 *     tags: ["discord", "typescript"],
 * },
 */
export const featuredProjects: FeaturedProject[] = [
    {
        name: "Cyfurden",
        description: "Independent booths for convention days. Artists list small-batch work, take pre-orders, "
            + "and match bank transfers by hand, with no marketplace or payment processor in between.",
        status: "live",
        repo: "kazeous/cyfurden",
        website: "https://cyfurden.kazeous.com",
        image: cyfurdenCover,
        imageAlt: "Cyfurden landing page with a preview booth and the day's pickup queue",
        tags: ["storefront", "pre-orders", "typescript"],
    },
    {
        name: "Pawket",
        description: "A workspace for artists, opening one piece at a time. Accounts, security and private creator "
            + "profiles work today; public pages, commissions, merchandise and tips are on the way.",
        status: "in-development",
        website: "https://pawket.kazeous.com",
        image: pawketCover,
        imageAlt: "Pawket landing page: a workspace for artists",
        tags: ["artists", "commissions"],
    },
];
