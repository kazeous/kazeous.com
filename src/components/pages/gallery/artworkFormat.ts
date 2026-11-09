const publishedFormat = new Intl.DateTimeFormat("en-US", {year: "numeric", month: "short", day: "numeric", timeZone: "UTC"});

/** Formats a `YYYY-MM-DD` publish date as e.g. "Apr 27, 2026" without shifting the day across time zones. */
export function formatPublished(date: string) {
    return publishedFormat.format(new Date(date));
}

/** Upper-cased file extension of an image URL, e.g. "WEBP". */
export function imageFormat(url: string) {
    return (url.split(/[?#]/)[0].split(".").pop() ?? "").toUpperCase();
}
