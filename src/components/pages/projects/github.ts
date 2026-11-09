/** The fields the Projects page reads from GitHub's "list repositories for a user" response. */
export type GitHubRepository = {
    id: number;
    name: string;
    full_name: string;
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

export const GITHUB_USERNAME = "kazeous";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
export const GITHUB_REPOSITORIES_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=100`;

export function formatUpdatedDate(date: string) {
    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}
