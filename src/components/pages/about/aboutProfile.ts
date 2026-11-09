import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {
    faCamera,
    faComputerMouse,
    faHeadphones,
    faKeyboard,
    faLaptop,
    faMobileScreen,
    faTabletScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import {allCharacters} from "../lore/characters.ts";

/*
 * Content for the About page. Every card reads from here; edit the values to update the page.
 * Hobbies and Next Steps show their `…Note` text while their list is empty.
 */

export type Entry = {label: string; value?: string; href?: string};
export type Device = Entry & {icon: IconDefinition};
export type Quote = {text: string; source: string};
export type SkillGroup = {title: string; items: {label: string; level: number}[]};

/*
 * Banner art for the top of the About pages. While it is undefined the banner shows the plain
 * gradient from about.css. To use a picture, import it and assign it here, for example:
 *   import banner from "../../../assets/about-banner.webp";
 *   export const heroImage: string | undefined = banner;
 */
export const heroImage: string | undefined = undefined;

export const profile = {
    name: "Kaze",
    tagline: "A dragon-shark wandering on a path.",
    facts: [
        {label: "Name", value: "Vu"},
        {label: "Country", value: "Viet Nam"},
        {label: "MBTI", value: "INTP"},
        {label: "Birthday", value: "Feb 11"},
    ],
};

export const quotes: Quote[] = [
    {
        text: "Would you rather live a quiet life as a nobody, or go out in a blaze of glory? Which way would you choose?",
        source: "Dexter DeShawn, Cyberpunk 2077",
    },
    {text: "No matter how harsh the world to you, always be kind", source: "Unknown"},
];

/* Card subtitle under "Character Details". */
export const characterDetailsSubtitle = "Fursona";

/* Characters come from the shared OC list (pages/lore/characters.ts) so names and links stay in sync. */
export const characterDetails: Entry[] = [
    {label: "Species", value: "Bunny"},
    ...allCharacters.map(character => ({label: character.name, value: character.note, href: character.href})),
];

export const gaming: Entry[] = [
    {
        label: "Currently Playing",
        value: "Cyberpunk 2077, Minecraft, Arknights, Arknights: Endfield, The Outlast Trials, Valorant, Delta Force",
    },
    {label: "Steam", value: "Kaze", href: "https://steamcommunity.com/id/Kazeous/"},
    {label: "Arknights", value: "Kazeous"},
    {label: "Favorite Genre", value: "Horror, FPS, anything I can play is fine"},
];

export const devices: Device[] = [
    {label: "Laptop", value: "Lenovo Legion 5 15ACH6H", icon: faLaptop},
    {label: "Phone", value: "Xiaomi Redmi Note 13 Pro", icon: faMobileScreen},
    {label: "Tablet / Watch", value: "None", icon: faTabletScreenButton},
    {label: "Headphones", value: "SteelSeries Arctis 7 Pro, Moondrop Spacetravel 2", icon: faHeadphones},
    {label: "Keyboard", value: "8BitDo Retro Mechanical", icon: faKeyboard},
    {label: "Mouse", value: "Razer DeathAdder V2 X", icon: faComputerMouse},
    {label: "Camera", value: "Thinking about buying one", icon: faCamera},
];

/* Levels are percentages (0–100). While the list is empty the card shows `hobbiesNote` instead. */
export const hobbies: SkillGroup[] = [];
export const hobbiesNote = "I will think of it later";

/* While the list is empty the card shows `nextStepsNote` instead. */
export const nextSteps: Entry[] = [];
export const nextStepsNote = "I dunno, tbh";
