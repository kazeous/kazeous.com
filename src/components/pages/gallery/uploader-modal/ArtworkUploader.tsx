import dayjs from "dayjs";
import React from "react";
import {useTagHooks} from "../../../../hooks/useTagHooks.ts";
import {artists, ArtTag, Rating} from "../../../../../api/src/images/TagUtils.ts";
import {BeerCssCombobox} from "../../../ui/BeerCssCombobox.tsx";
import {BeerCSSRadio} from "../../../ui/BeerCSSRadio.tsx";
import {BeerCSSTextField} from "../../../ui/BeerCSSTextField.tsx";
import {BeerCSSCheckbox} from "../../../ui/BeerCSSCheckbox.tsx";
import axios from "axios";
import {prepareFileName} from "../../../../../api/src/utils/utils.ts";
import {toast, ToastContainer} from "react-toastify";
import {Controller, useForm, useWatch} from "react-hook-form";
import type {ImageInformation} from "../../../../../api/src/images/ImageInformation.ts";
import _ from "lodash";

interface BaseImageValues {
    file: FileList;
    tags: ArtTag[];
    href: string;
    characters: string[];
    rating: Rating;
    hidden: boolean;
}

interface ParentImageValues extends BaseImageValues {
    title: string;
    artist: string;
    published: string;
}

interface AltImageValues extends BaseImageValues {
    altType: "complex" | "cropped" | "recolor" | "extra";
    complexInfo?: { pageNumber?: number, altNumber?: number }
}

type ImageValues = ParentImageValues | AltImageValues;

type AltProps = {
    variant: "alt",
    parent: ImageInformation
}

type ParentProps = {
    variant: "parent"
}

export function ArtworkUploader(props: AltProps | ParentProps) {
    const {images, isImageHidden} = useTagHooks();
    const {register, handleSubmit, control, reset, formState: {isSubmitting}} = useForm<ImageValues>({
        defaultValues: {
            tags: props.variant === "alt" ? props.parent.tags as ArtTag[] : [],
            characters: props.variant === "alt" ? props.parent.characters : ["Kaze Hishou"],
            href: props.variant === "alt" ? props.parent.href : "",
            published: dayjs().format("YYYY-MM-DD"),
            hidden: false
        },
    });

    const [watchTitle, watchFile, watchRating, watchAltType, watchArtist, watchHidden] = useWatch({
        control,
        name: ["title", "file", "rating", "altType", "artist", "hidden"],
    });
    const isCollision = images.map(i => prepareFileName(i.title)).includes(prepareFileName(watchTitle));

    const onSubmit = async (data: ImageValues) => {
        const file = data.file[0];
        if (!file || !data.rating) return;

        function isParent(values: ImageValues): values is ParentImageValues {
            return (values as ParentImageValues).title !== undefined;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("tags", data.tags.join(", "));
        formData.append("href", data.href);
        formData.append("characters", data.characters.join(", "));
        formData.append("rating", data.rating);
        formData.append("isHidden", JSON.stringify(data.hidden || isParentHidden));
        if (isParent(data)) {
            formData.append("title", data.title);
            formData.append("artist", data.artist);
            formData.append("published", data.published);
        } else {
            formData.append("altType", watchAltType === "complex" ? JSON.stringify(data.complexInfo) : data.altType);
            formData.append("imageName", (props as AltProps).parent.title);
        }

        try {
            await axios.post(isParent(data) ? "http://localhost:9000/upload" : "http://localhost:9000/upload-alt", formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            toast("Upload success!");
            reset();
        } catch (err) {
            console.error(err);
        }
    };

    const {variant} = props;

    const isParent = variant === "parent";
    const isParentHidden = variant === "alt" && isImageHidden(props.parent);
    return <>
        <button popoverTarget={'uploader'} className="extend square round secondary" style={{position: "fixed", bottom: "2rem", right: "2rem", display: "flex"}}>
            <i>upload</i> <span>Upload</span>
        </button>
        <dialog popover={'auto'} style={{maxHeight: "90vh", maxWidth: 600}} id={'uploader'} className={"large-padding"}>
            <h3>Upload New Image</h3>
            <p>Enter a list of tags, the handle of the artist, and the file name to automatically compress and upload this file!</p>
            <form onSubmit={handleSubmit(onSubmit)} style={{display: "flex", flexDirection: "column", gap: "1rem"}} className="bottom-margin fade">
                {/*TODO Combine Artwork Title and File Fields*/}
                <BeerCSSTextField type="file" label="File" inputPrefix={<i>attach_file</i>} {...register("file", {required: true})} />
                {isParent && <>
                    <BeerCSSTextField type="text" label="Artwork Title" inputPrefix={<i>title</i>} errorText={isCollision && "The title already exists! This may overwrite that artwork entry!"} {...register("title", {required: true})}/>
                    <Controller name="artist" control={control} rules={{required: true}} render={({field}) => <BeerCssCombobox closeOnChangedValue
                                                                                                                               isCreatable
                                                                                                                               renderText
                                                                                                                               placeholder="Artist Handle"
                                                                                                                               value={field.value ? [{label: field.value, value: field.value}] : []}
                                                                                                                               options={artists.map(a => ({label: a, value: a}))}
                                                                                                                               onChange={opts => field.onChange(opts[1]?.value ?? opts[0]?.value ?? "")}
                    />}/>
                    <BeerCSSTextField type="date" label="Published Date" {...register("published", {required: true})} />
                </>}

                <Controller name="tags" control={control} render={({field}) => <BeerCssCombobox placeholder="Tags" value={field.value.map(v => ({label: v, value: v}))} options={Object.values(ArtTag).map(v => ({label: v, value: v}))} onChange={opts => field.onChange(opts.map(o => o.value))}/>}/>
                <BeerCSSTextField type="text" label="URL" inputPrefix={<i>link</i>} {...register("href")} />
                <Controller name="characters" control={control} render={({field}) => <BeerCssCombobox isCreatable placeholder="Characters" value={field.value.map(v => ({label: v, value: v}))} options={Array.from(new Set(images.flatMap(i => i.characters).concat(field.value))).map(v => ({label: v, value: v}))} onChange={opts => field.onChange(opts.map(o => o.value))}/>}/>

                {variant === "alt" && <fieldset className={"no-margin"}>
                    <legend>Alt Type</legend>
                    <nav>
                        {(["extra", "cropped", "recolor"] as const).map(r => <BeerCSSRadio key={r} label={_.capitalize(r)} {...register("altType", {required: true})} value={r}/>)}
                        <BeerCSSRadio label={"Complex"} {...register("altType", {required: true})} value={"complex"}/>
                    </nav>
                    <nav>
                        {watchAltType === "complex" && <>
                            <BeerCSSTextField label={"Page"} type={"number"} {...register("complexInfo.pageNumber")} />
                            <BeerCSSTextField label={"Alt"} type={"number"} {...register("complexInfo.altNumber")} />
                        </>}
                    </nav>
                </fieldset>}
                <fieldset className="no-margin">
                    <legend>Rating</legend>
                    <nav>
                        {(["mainstream", "general", "sensitive", "mature"] as const).map(r => <BeerCSSRadio key={r} label={_.capitalize(r)} {...register("rating", {required: true})} value={r}/>)}
                    </nav>
                    <BeerCSSCheckbox {...register("hidden", {disabled: isParentHidden})} checked={isParentHidden ? true : watchHidden} label="Hidden" className="top-margin"/>
                </fieldset>
                <div className={"right-align"}>
                    <button type="submit" className="primary" disabled={isSubmitting || !watchFile || isParent && (!watchArtist || !watchTitle) || !watchRating}>
                        <i>upload</i> <span>Upload</span>
                    </button>
                </div>
            </form>
        </dialog>
        <ToastContainer/>
    </>;
}
