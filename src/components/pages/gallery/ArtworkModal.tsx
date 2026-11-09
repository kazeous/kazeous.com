import {type CSSProperties, type MouseEvent, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {Link} from "react-router-dom";
import _ from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowUpRightFromSquare,
    faCircleCheck,
    faEllipsis,
    faLink,
    faMagnifyingGlassPlus,
    faUserAstronaut,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {type AltInformation, getHref, type ImageBase, type ImageInformation} from "../../../../api/src/images/ImageInformation.ts";
import {ArtTag} from "../../../../api/src/images/TagUtils.ts";
import {useIsDevelopment} from "../../../hooks/useIsDevelopment.ts";
import {ArtworkUploader} from "./uploader-modal/ArtworkUploader.tsx";
import {ImageViewer} from "./ImageViewer.tsx";
import {formatPublished} from "./artworkFormat.ts";
import {findCharacter} from "../lore/characters.ts";
import {useModalDialog} from "./useModalDialog.ts";
import "./artwork-modal.css";

/** Detail panel shown over the gallery when a card is opened; clicking the artwork opens the zoomable viewer. */
export function ArtworkModal({image, alts, initialVariantId, onClose}: Readonly<{
    image: ImageInformation;
    alts: AltInformation[];
    initialVariantId?: string;
    onClose: () => void;
}>) {
    const dialogRef = useModalDialog(onClose);
    const isDevelopment = useIsDevelopment();
    const variants: ImageBase[] = [image, ...alts];
    const [selectedId, setSelectedId] = useState(initialVariantId ?? image.id);
    const selected = variants.find(variant => variant.id === selectedId) ?? image;
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const artistHref = getHref(image.artist);
    const artistUrl = /^https?:\/\//.test(artistHref) ? artistHref : undefined;
    const isSticker = image.tags.includes(ArtTag.sticker);
    const tags = selected.tags.filter(tag => tag !== ArtTag.sticker).sort((a, b) => a.localeCompare(b));

    // Close when a click both starts and ends on the backdrop (not when a text selection drags out of the panel).
    const pressedOnBackdrop = useRef(false);
    const onBackdropDown = (event: MouseEvent<HTMLDialogElement>) => {
        pressedOnBackdrop.current = event.target === event.currentTarget;
    };
    const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (pressedOnBackdrop.current && event.target === event.currentTarget) onClose();
    };

    return createPortal(<dialog
        ref={dialogRef}
        className="artwork-modal"
        aria-labelledby="artwork-modal-title"
        onMouseDown={onBackdropDown}
        onClick={onBackdropClick}
    >
        <div className="am-topbar">
            <button type="button" className="gx-btn gx-icon-btn" onClick={onClose} aria-label="Close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>
            <ArtworkMenu originalUrl={selected.src} postUrl={image.href}/>
        </div>

        <div className="am-body">
            <button
                type="button"
                className="gx-btn am-media"
                style={{"--artwork-ratio": selected.aspectRatio} as CSSProperties}
                onClick={() => setIsViewerOpen(true)}
                aria-label={`View ${image.title} full size`}
            >
                <img src={selected.thumbnailUrl} alt={image.title}/>
                <span className="am-media-hint" aria-hidden="true">
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus}/> Click to zoom
                </span>
            </button>

            <div className="am-info">
                <div className="am-artist">
                    <span className="am-avatar" aria-hidden="true">{image.artist.replace(/^@/, "").charAt(0).toUpperCase() || "?"}</span>
                    <div className="am-artist-text">
                        <p className="am-artist-name">{image.artist || "Unknown artist"}</p>
                        <p className="am-artist-role">Artist</p>
                    </div>
                    {artistUrl && <a className="gx-btn gx-pill-btn" href={artistUrl} target="_blank" rel="noreferrer">
                        Profile <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>
                    </a>}
                </div>

                <h2 id="artwork-modal-title" className="am-title">{image.title}</h2>
                <p className="am-badge">
                    <FontAwesomeIcon icon={faCircleCheck}/> {isSticker ? "Sticker set" : "Commissioned"}
                </p>

                {selected.characters.length > 0 && <section className="am-block" aria-label="Featured characters">
                    <h3>Featured</h3>
                    {selected.characters.map(character => {
                        // Known OCs link straight to their character sheet; anything else falls back to the OC page.
                        const sheetUrl = findCharacter(character)?.href;
                        return <div className="am-feature" key={character}>
                            <span className="am-feature-icon" aria-hidden="true"><FontAwesomeIcon icon={faUserAstronaut}/></span>
                            <div className="am-feature-text">
                                <p className="am-feature-name">{character}</p>
                                <p className="am-feature-role">Character</p>
                            </div>
                            {sheetUrl
                                ? <a className="gx-btn gx-pill-btn" href={sheetUrl} target="_blank" rel="noreferrer">
                                    View OC <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>
                                </a>
                                : <Link className="gx-btn gx-pill-btn" to="/lore">
                                    View OC <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>
                                </Link>}
                        </div>;
                    })}
                </section>}

                {variants.length > 1 && <section className="am-block" aria-label="Versions">
                    <h3>Versions</h3>
                    <div className="am-versions">
                        {variants.map((variant, index) =>
                            <button
                                type="button"
                                key={variant.id}
                                className="gx-btn am-version"
                                aria-pressed={variant.id === selected.id}
                                aria-label={index === 0 ? "Original version" : `Alternate version ${index}`}
                                onClick={() => setSelectedId(variant.id)}
                            >
                                <img src={variant.thumbnailUrl} alt=""/>
                            </button>
                        )}
                    </div>
                </section>}

                <ul className="am-chips" aria-label="Tags">
                    {tags.map(tag => <li className="am-chip" key={tag}>{tag}</li>)}
                    <li className="am-chip am-chip-muted">{_.capitalize(selected.rating)}</li>
                </ul>

                <p className="am-published">Published <time dateTime={image.published}>{formatPublished(image.published)}</time></p>
            </div>
        </div>

        {isDevelopment && <ArtworkUploader variant={"alt"} parent={image}/>}
        {isViewerOpen && <ImageViewer src={selected.webp} title={image.title} onClose={() => setIsViewerOpen(false)}/>}
    </dialog>, document.body);
}

function ArtworkMenu({originalUrl, postUrl}: Readonly<{originalUrl: string; postUrl?: string}>) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const onPointerDown = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [isOpen]);

    useEffect(() => {
        if (!copied) return;
        const timer = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timer);
    }, [copied]);

    const copyLink = () => {
        navigator.clipboard?.writeText(window.location.href).then(() => setCopied(true), () => undefined);
    };

    return <div className="am-menu" ref={menuRef}>
        <button
            type="button"
            className="gx-btn gx-icon-btn"
            aria-label="More options"
            aria-haspopup="menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(open => !open)}
        >
            <FontAwesomeIcon icon={faEllipsis}/>
        </button>
        {isOpen && <div className="am-menu-list" role="menu">
            <button type="button" role="menuitem" className="gx-btn am-menu-item" onClick={copyLink}>
                <FontAwesomeIcon icon={faLink}/> {copied ? "Link copied" : "Copy link"}
            </button>
            <a role="menuitem" className="gx-btn am-menu-item" href={originalUrl} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faArrowUpRightFromSquare}/> Open original file
            </a>
            {postUrl && <a role="menuitem" className="gx-btn am-menu-item" href={postUrl} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faArrowUpRightFromSquare}/> Original post
            </a>}
        </div>}
    </div>;
}
