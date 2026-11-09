import images from "./images.json";
import {type ImageEntry} from "./ImageInformation";

export enum ArtTag {
    featured = 'Featured',
    superhero = 'Superhero',
    bows = 'Bow',
    lances = 'Lances',
    knives = 'Knives',
    jupiter = 'Jupiter Form',
    techwear = 'Techwear',
    standardOutfit = 'Standard Outfit',
    bodysuit = 'Bodysuit',
    hoodie = 'Hoodie',
    aicore = 'AICore Form',
    awakened = 'Gemini Form',
    ultra = 'Triangulum Form',
    thuban = 'Thuban Form',
    rastaban = 'Rastaban Form',
    eltanin = 'Eltanin Form',
    indra = 'Indra Suit',
    gungrir = 'Gungrir Suit',
    aldhibah = 'Aldhibah Form',
    icarus = 'Icarus Suit',
    tf = 'Transformation',
    eclipse = 'Eclipse Deity',
    vernal = 'Vernal',
    estival = 'Estival Checker',
    serotinal = 'Serotinal Circuitboard',
    autumnal = 'Autumnal Wavesniper',
    winter = 'Hibernal Assassin',
    auriga = 'Auriga Form',
    illustration = 'Illustration',
    reference = 'Character Reference',
    chibi = 'Chibi',
    icon = 'Icon',
    halfBody = 'Half Body',
    fullBody = 'Full Body',
    sequence = 'Sequence',
    sketchpage = 'Sketchpage',
    sketch = 'Sketch',
    sticker = 'Sticker'

}

export enum Rating {
    Mainstream = 'mainstream',
    General = 'general',
    Sensitive = 'sensitive',
    Mature = 'mature'
}

export type FilterSetting = -1 | 0 | 1;
export const artists = Array.from(new Set(images.filter(value => value.artist !== undefined && value.artist !== '').map<string>(imageData => imageData.artist as string))).sort((a, b) => a.localeCompare(b));
export const characters = Array.from(new Set(images.filter(value => value.characters !== undefined).flatMap<string>(imageData => imageData.characters))).sort((a, b) => a.localeCompare(b));

export class SelectedFilters {
    readonly _artists: Record<string, FilterSetting>;
    readonly _tags: Record<string, FilterSetting>;
    readonly _ratings: Record<string, FilterSetting>;
    readonly _characters: Record<string, FilterSetting>;

    constructor(filters?: string) {
        this._artists = artists.reduce((previousValue, currentValue) => ({...previousValue, [currentValue]: 0}), {});
        this._tags = Object.values(ArtTag).reduce((previousValue, currentValue) => ({...previousValue, [currentValue]: 0}), {});
        this._ratings = Object.values(Rating).reduce((previousValue, currentValue) => ({...previousValue, [currentValue]: 0}), {});
        this._characters = characters.reduce((previousValue, currentValue) => ({...previousValue, [currentValue]: 0}), {});
        if (filters && filters !== '') {
            const filterArray = filters.split('+');
            filterArray.forEach(value => {
                const filterName = value.charAt(0) === '-' ? value.substring(1) : value;
                const filterValue: FilterSetting = value.charAt(0) === '-' ? -1 : 1;
                if (Object.keys(this._artists).includes(filterName)) {
                    this._artists[filterName] = filterValue;
                } else if (Object.keys(this._tags).includes(filterName)) {
                    this._tags[filterName] = filterValue;
                } else if (Object.keys(this._characters).includes(filterName)) {
                    this._characters[filterName] = filterValue;
                } else if (Object.keys(this._ratings).includes(filterName)) {
                    this._ratings[filterName] = filterValue;
                } else {
                    // TODO Throw error
                }
            })
        }
    }

    get artists(): Record<string, FilterSetting> {
        return this._artists;
    }

    get tags(): Record<string, FilterSetting> {
        return this._tags;
    }

    get ratings(): Record<string, FilterSetting> {
        return this._ratings;
    }

    get characters(): Record<string, FilterSetting> {
        return this._characters;
    }

    static getFilterType(filter: string): 'Character' | 'Rating' | 'Artist' | 'Tag' | undefined {
        if (characters.includes(filter)) {
            return 'Character'
        } else if ((Object.values(ArtTag) as string[]).includes(filter)) {
            return 'Tag'
        } else if ((Object.values(Rating) as string[]).includes(filter)) {
            return 'Rating'
        } else if (artists.includes(filter)) {
            return 'Artist'
        } else {
            return undefined;
        }
    }

    toArray() {
        return this.toString() === '' ? [] : this.toString().split('+');
    }

    toString() {
        return [this.serializeTagType(this._artists), this.serializeTagType(this._tags), this.serializeTagType(this._ratings), this.serializeTagType(this._characters)].filter(value => value).join('+');
    }

    doesImageMatch(image: ImageEntry & { artist: string }, mode: 'and' | 'or') {
        const imageFilterableInfo = [...image.tags, image.artist, ...image.characters, image.rating];
        const filters = this.toArray();
        const enabledFilters = filters.filter(value => !value.startsWith('-'))
        const blacklistedFilters = filters.filter(value => value.startsWith('-')).map(value => value.substring(1))
        const hasNoBlacklistedFilters = !blacklistedFilters.some(value => imageFilterableInfo.includes(value));
        if (enabledFilters.length > 0) {
            if (mode === 'and') {
                return enabledFilters.every(value => imageFilterableInfo.includes(value)) && hasNoBlacklistedFilters
            }
            if (mode === 'or') {
                return enabledFilters.some(value => imageFilterableInfo.includes(value)) && hasNoBlacklistedFilters
            }
        } else {
            return hasNoBlacklistedFilters;
        }
    }

    private serializeTagType(filters: Record<string, FilterSetting>) {
        return Object.entries(filters)
            .filter(value => value[1] !== 0)
            .map(value => value[1] === -1 ? `-${value[0]}` : value[0]).join('+');
    }
}

export const tagGroup: Record<string, ArtTag[]> = {
    Clothing: [ArtTag.bodysuit, ArtTag.hoodie, ArtTag.autumnal, ArtTag.serotinal, ArtTag.vernal, ArtTag.estival, ArtTag.winter, ArtTag.standardOutfit, ArtTag.techwear],
    "Evolution Level": [ArtTag.thuban, ArtTag.rastaban, ArtTag.eltanin, ArtTag.awakened, ArtTag.ultra, ArtTag.eclipse]
}
