import {useDocumentTitle} from "usehooks-ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {PageHero} from "../../layout/PageHero.tsx";
import {SectionHeading} from "../../layout/SectionHeading.tsx";
import {type Character, collections} from "./characters.ts";
import "./lore.css";

function CharacterCard({character}: Readonly<{character: Character}>) {
    return <a href={character.href} target="_blank" rel="noopener noreferrer" className="surface-card oc-card">
        <div className="surface-card-media oc-card-media">
            {character.image
                ? <img src={character.image} alt={character.imageAlt ?? character.name} loading="lazy" decoding="async"/>
                : <span className="oc-card-placeholder" role="img" aria-label={`Artwork for ${character.name} to be announced`}>TBA</span>}
        </div>
        <div className="oc-card-body">
            <h3 className="oc-card-name">{character.name}</h3>
            <p className="oc-card-note">{character.note}</p>
        </div>
        <div className="oc-card-foot">
            <span>VGen</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true"/>
        </div>
    </a>;
}

export function OCList() {
    useDocumentTitle("OC - kazeous.com");

    return <div className="oc-page fade">
        <PageHero
            title="OC"
            kicker="Original characters"
            description="Character sheets, worlds, and fragments of lore collected in one place."
            variant="oc"
            wide
        />
        <div className="page-body page-body-wide oc-sections">
            {collections.map(collection =>
                <section className="oc-section" key={collection.id} aria-labelledby={`oc-${collection.id}`}>
                    <SectionHeading
                        id={`oc-${collection.id}`}
                        title={collection.name}
                        kicker={`${collection.characters.length} ${collection.characters.length === 1 ? "character" : "characters"}`}
                    />
                    <div className="card-grid">
                        {collection.characters.map(character => <CharacterCard key={character.name} character={character}/>)}
                    </div>
                </section>
            )}
        </div>
    </div>;
}
