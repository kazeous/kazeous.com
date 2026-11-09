import {type ReactNode, useEffect, useState} from "react";
import {useDocumentTitle} from "usehooks-ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxOpen, faCodeFork, faGlobe, faStar, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {PageHero} from "../../layout/PageHero.tsx";
import {SectionHeading} from "../../layout/SectionHeading.tsx";
import "./projects.css";

type GitHubRepository = {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
    archived: boolean;
    pushed_at: string;
    topics: string[];
};

const GITHUB_USERNAME = "kazeous";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_REPOSITORIES_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=100`;

function formatUpdatedDate(date: string) {
    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

/** The repo name is a stretched link (its ::after covers the card); the homepage link sits above it. */
function ProjectCard({project}: Readonly<{project: GitHubRepository}>) {
    return <div className="surface-card project-card">
        <div className="project-card-head">
            <h3 className="project-card-title">
                <a className="project-card-link" href={project.html_url} target="_blank" rel="noopener noreferrer">
                    {project.name}
                </a>
            </h3>
            {project.archived && <span className="project-badge">Archived</span>}
        </div>

        <p className="project-description">{project.description || "A code project by Kaze."}</p>

        {project.topics.length > 0 && <ul className="project-topics" aria-label="Topics">
            {project.topics.slice(0, 4).map(topic => <li className="project-topic" key={topic}>{topic}</li>)}
        </ul>}

        <div className="project-card-foot">
            <div className="project-meta">
                {project.language && <span><span className="language-dot" aria-hidden="true"/>{project.language}</span>}
                {project.stargazers_count > 0 && <span title="Stars">
                    <FontAwesomeIcon icon={faStar} aria-hidden="true"/>{project.stargazers_count}
                </span>}
                {project.forks_count > 0 && <span title="Forks">
                    <FontAwesomeIcon icon={faCodeFork} aria-hidden="true"/>{project.forks_count}
                </span>}
            </div>
            {project.homepage && <a
                className="project-homepage"
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.name} website`}
                title="Website"
            >
                <FontAwesomeIcon icon={faGlobe} aria-hidden="true"/>
            </a>}
        </div>

        <p className="project-updated">Updated <time dateTime={project.pushed_at}>{formatUpdatedDate(project.pushed_at)}</time></p>
    </div>;
}

function ProjectSkeleton() {
    return <div className="surface-card project-card project-skeleton" aria-hidden="true">
        <div className="skeleton-line skeleton-title"/>
        <div className="skeleton-line"/>
        <div className="skeleton-line skeleton-short"/>
    </div>;
}

function ProjectsNotice({icon, title, children}: Readonly<{icon: typeof faBoxOpen; title: string; children?: ReactNode}>) {
    return <div className="surface-card projects-notice">
        <span className="projects-notice-icon" aria-hidden="true"><FontAwesomeIcon icon={icon}/></span>
        <h3>{title}</h3>
        {children}
    </div>;
}

export function Projects() {
    useDocumentTitle("Projects - kazeous.com");
    const [projects, setProjects] = useState<GitHubRepository[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProjects() {
            try {
                const response = await fetch(GITHUB_REPOSITORIES_URL, {
                    signal: controller.signal,
                    headers: {Accept: "application/vnd.github+json"},
                });

                if (!response.ok) {
                    throw new Error(`GitHub returned ${response.status}`);
                }

                const repositories = await response.json() as GitHubRepository[];
                setProjects(repositories.filter(repository => !repository.fork));
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    setHasError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadProjects();
        return () => controller.abort();
    }, []);

    const kicker = isLoading
        ? "Loading…"
        : hasError ? "GitHub" : `${projects.length} public ${projects.length === 1 ? "repository" : "repositories"}`;

    return <div className="projects-page fade">
        <PageHero
            title="Projects"
            kicker="Code"
            description="Code experiments, tools, and other things I have been tinkering with."
            variant="projects"
            wide
        />
        <div className="page-body page-body-wide projects-sections">
            <section className="projects-section" aria-labelledby="projects-repositories">
                <SectionHeading
                    id="projects-repositories"
                    title="Repositories"
                    kicker={kicker}
                    action={<a className="page-pill-link" href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} aria-hidden="true"/> GitHub
                    </a>}
                />

                {hasError && <ProjectsNotice icon={faTriangleExclamation} title="Could not load the projects right now.">
                    <p>You can still find all of them on GitHub.</p>
                    <a className="page-pill-link" href={`${GITHUB_PROFILE_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer">
                        View repositories
                    </a>
                </ProjectsNotice>}

                {!hasError && <div className="projects-grid">
                    {isLoading
                        ? Array.from({length: 6}, (_, index) => <ProjectSkeleton key={index}/>)
                        : projects.map(project => <ProjectCard project={project} key={project.id}/>)}
                </div>}

                {!isLoading && !hasError && projects.length === 0 && <ProjectsNotice icon={faBoxOpen} title="No public projects yet."/>}
            </section>
        </div>
    </div>;
}
