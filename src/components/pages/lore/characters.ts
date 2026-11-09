/*
 * Original characters, shared by the OC page, the About page and the gallery's artwork modal.
 * `name` must match the `characters` values in api/src/images/images.json so artworks link to the right OC.
 * Leave `image` out to show a grey "TBA" placeholder.
 */

export type Character = {name: string; href: string; note: string; image?: string; imageAlt?: string};
export type Collection = {id: string; name: string; characters: Character[]};

export const collections: Collection[] = [
    {
        id: "furverse",
        name: "Furverse",
        characters: [
            {
                name: "Leonhardt Rune Solberg",
                href: "https://vsona.vgen.co/soleon-rune",
                note: "Character sheet on VGen",
            },
            {
                name: "Kaze Hishou",
                href: "https://vsona.vgen.co/kazehishou",
                note: "Character sheet on VGen",
                image: "https://kaze-art0-bucket.s3.amazonaws.com/thumbnail/cmere.webp",
                imageAlt: "Gallery artwork used temporarily for Kaze Hishou",
            },
        ],
    },
];

export const allCharacters = collections.flatMap(collection => collection.characters);

export function findCharacter(name: string) {
    return allCharacters.find(character => character.name === name);
}
