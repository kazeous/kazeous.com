import clsx from "clsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faStar} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {formatUpdatedDate, type GitHubRepository} from "./github.ts";
import type {FeaturedProject, ProjectStatus} from "./projects.ts";

const statusLabels: Record<ProjectStatus, string> = {
    "live": "Live",
    "in-development": "In development",
    "archived": "Archived",
};

/**
 * The name is a stretched link to the website (or the repo when there is none); the Repo and Website
 * pills sit above it so each stays clickable on its own. `repository` is the GitHub data, when public.
 */
export function FeaturedProjectCard({project, repository}: Readonly<{
    project: FeaturedProject;
    repository?: GitHubRepository;
}>) {
    const repoUrl = repository?.html_url ?? (project.repo ? `https://github.com/${project.repo}` : undefined);
    const primaryUrl = project.website ?? repoUrl;

    return <div className={clsx("surface-card", "featured-card", !primaryUrl && "featured-card-static")}>
        <div className="surface-card-media featured-card-media">
            {project.image
                ? <img src={project.image} alt={project.imageAlt ?? ""} loading="lazy" decoding="async"/>
                : <span className="featured-card-placeholder" aria-hidden="true">{project.name.charAt(0)}</span>}
        </div>

        <div className="featured-card-body">
            <div className="featured-card-head">
                <h3 className="featured-card-title">
                    {primaryUrl
                        ? <a className="featured-card-link" href={primaryUrl} target="_blank" rel="noopener noreferrer">
                            {project.name}
                        </a>
                        : project.name}
                </h3>
                <span className={`project-status project-status-${project.status}`}>{statusLabels[project.status]}</span>
            </div>

            <p className="featured-card-description">{project.description}</p>

            {project.tags && project.tags.length > 0 && <ul className="project-topics" aria-label="Tags">
                {project.tags.slice(0, 4).map(tag => <li className="project-topic" key={tag}>{tag}</li>)}
            </ul>}
        </div>

        {primaryUrl && <div className="featured-card-foot">
            <div className="project-meta">
                {repository && repository.stargazers_count > 0 && <span title="Stars">
                    <FontAwesomeIcon icon={faStar} aria-hidden="true"/>{repository.stargazers_count}
                </span>}
                {repository && <span>
                    Updated <time dateTime={repository.pushed_at}>{formatUpdatedDate(repository.pushed_at)}</time>
                </span>}
            </div>
            <div className="featured-card-links">
                {repoUrl && <a className="page-pill-link" href={repoUrl} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} aria-hidden="true"/> Repo
                </a>}
                {project.website && <a className="page-pill-link" href={project.website} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGlobe} aria-hidden="true"/> Website
                </a>}
            </div>
        </div>}
    </div>;
}
