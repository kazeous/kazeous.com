import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaintbrush} from "@fortawesome/free-solid-svg-icons";
import type {ImageInformation} from "../../../../api/src/images/ImageInformation.ts";
import {ArtTag} from "../../../../api/src/images/TagUtils.ts";
import {formatPublished} from "./artworkFormat.ts";

/** Opens the artwork's detail modal by adding `?artwork=<id>` to the gallery URL (so Back closes it). */
export function ArtworkCard({image, hasAlts}: Readonly<{image: ImageInformation; hasAlts: boolean}>) {
    const tags = image.tags.filter(tag => tag !== ArtTag.sticker);
    return <Link
        to={{search: `?artwork=${encodeURIComponent(image.id)}`}}
        state={{openedFromGallery: true}}
        preventScrollReset
        className="surface-card artwork-card"
    >
        <div className="surface-card-media artwork-card-media">
            <img src={image.thumbnailUrl} alt={image.title} loading="lazy" decoding="async"/>
            {hasAlts && <span className="artwork-card-badge">Alt versions</span>}
        </div>
        <div className="artwork-card-body">
            <h3 className="artwork-card-title">{image.title}</h3>
            {tags.length > 0 && <p className="artwork-card-meta">{tags.join(" · ")}</p>}
        </div>
        <div className="artwork-card-foot">
            <span className="artwork-card-artist">
                <FontAwesomeIcon icon={faPaintbrush} aria-hidden="true"/>
                <span>{image.artist || "Unknown artist"}</span>
            </span>
            <time dateTime={image.published}>{formatPublished(image.published)}</time>
        </div>
    </Link>;
}
