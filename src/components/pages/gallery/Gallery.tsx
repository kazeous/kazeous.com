import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useDocumentTitle} from "usehooks-ts";
import {useTagHooks} from "../../../hooks/useTagHooks.ts";
import {useIsDevelopment} from "../../../hooks/useIsDevelopment.ts";
import {type ImageInformation, isAltInformation} from "../../../../api/src/images/ImageInformation.ts";
import {ArtTag} from "../../../../api/src/images/TagUtils.ts";
import {PageHero} from "../../layout/PageHero.tsx";
import {SectionHeading} from "../../layout/SectionHeading.tsx";
import {ArtworkUploader} from "./uploader-modal/ArtworkUploader.tsx";
import {ArtworkCard} from "./ArtworkCard.tsx";
import {ArtworkModal} from "./ArtworkModal.tsx";
import "./gallery.css";

function GallerySection({id, title, kicker, images, altTitles}: Readonly<{
    id: string;
    title: string;
    kicker: string;
    images: ImageInformation[];
    altTitles: Set<string>;
}>) {
    if (images.length === 0) return null;
    return <section className="gallery-section" aria-labelledby={id}>
        <SectionHeading id={id} title={title} kicker={kicker}/>
        <div className="card-grid">
            {images.map(image => <ArtworkCard key={image.id} image={image} hasAlts={altTitles.has(image.title)}/>)}
        </div>
    </section>;
}

export function Gallery() {
    const {images, altData, imageEntries} = useTagHooks();
    const isDevelopment = useIsDevelopment();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    useDocumentTitle("Gallery - kazeous.com");

    const newestFirst = [...images].sort((a, b) => b.published.localeCompare(a.published));
    const stickers = newestFirst.filter(image => image.tags.includes(ArtTag.sticker));
    const commissions = newestFirst.filter(image => !image.tags.includes(ArtTag.sticker));
    const altTitles = new Set(altData.keys());

    // `?artwork=<id>` opens the detail modal; the id may point at an alt, which opens its parent on that version.
    const openId = searchParams.get("artwork");
    const openEntry = openId ? imageEntries.find(entry => entry.id === openId) : undefined;
    const openImage = openEntry && (isAltInformation(openEntry) ? images.find(image => image.title === openEntry.parent) : openEntry);

    function closeArtwork() {
        // Opened by a card click: step back so the history has no leftover modal entry.
        if ((location.state as {openedFromGallery?: boolean} | null)?.openedFromGallery) {
            navigate(-1);
            return;
        }
        setSearchParams(current => {
            const next = new URLSearchParams(current);
            next.delete("artwork");
            return next;
        }, {replace: true, preventScrollReset: true});
    }

    return <>
        <div className="gallery-page fade">
            <PageHero title="Gallery" kicker="Artworks" variant="gallery" wide/>
            <div className="page-body page-body-wide gallery-sections">
                <GallerySection
                    id="gallery-stickers"
                    title="Stickers"
                    kicker={`${stickers.length} ${stickers.length === 1 ? "set" : "sets"}`}
                    images={stickers}
                    altTitles={altTitles}
                />
                <GallerySection
                    id="gallery-commissions"
                    title="Commissions"
                    kicker={`${commissions.length} ${commissions.length === 1 ? "artwork" : "artworks"}`}
                    images={commissions}
                    altTitles={altTitles}
                />
            </div>
        </div>
        {openImage && <ArtworkModal
            key={openImage.id}
            image={openImage}
            alts={altData.get(openImage.title) ?? []}
            initialVariantId={openEntry?.id}
            onClose={closeArtwork}
        />}
        {isDevelopment && !openImage && <ArtworkUploader variant={"parent"}/>}
    </>;
}
