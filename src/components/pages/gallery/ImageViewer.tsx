import {type KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useEffectEvent, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {
    faCompress,
    faDownLeftAndUpRightToCenter,
    faExpand,
    faHouse,
    faMagnifyingGlassMinus,
    faMagnifyingGlassPlus,
    faRotateLeft,
    faRotateRight,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {imageFormat} from "./artworkFormat.ts";
import {useModalDialog} from "./useModalDialog.ts";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1.25;
const STAGE_PADDING = 32;

type Point = {x: number; y: number};
/** `zoom` is the ratio to the image's natural size; "fit" tracks the stage size until the visitor zooms. */
type View = {zoom: number | "fit"; rotation: number; x: number; y: number};
type Gesture =
    | {kind: "pan"; start: Point; origin: Point}
    | {kind: "pinch"; startDistance: number; startZoom: number; startMid: Point; origin: Point};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a: Point, b: Point) => ({x: (a.x + b.x) / 2, y: (a.y + b.y) / 2});

/** Full-screen focus view with zoom, pan, rotate and fullscreen controls. */
export function ImageViewer({src, title, onClose}: Readonly<{src: string; title: string; onClose: () => void}>) {
    const dialogRef = useModalDialog(onClose);
    // The Fullscreen API rejects <dialog> elements ("Dialog elements are invalid"), so a wrapper div goes fullscreen.
    const frameRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const canFullscreen = document.fullscreenEnabled;
    const [natural, setNatural] = useState<{width: number; height: number} | null>(null);
    const [stage, setStage] = useState({width: 0, height: 0});
    const [view, setView] = useState<View>({zoom: "fit", rotation: 0, x: 0, y: 0});
    const [isGesturing, setIsGesturing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const pointers = useRef(new Map<number, Point>());
    const gesture = useRef<Gesture | null>(null);

    const isSideways = Math.abs(view.rotation % 180) === 90;
    const boxWidth = natural ? (isSideways ? natural.height : natural.width) : 1;
    const boxHeight = natural ? (isSideways ? natural.width : natural.height) : 1;
    const fit = natural && stage.width > 0
        ? Math.min(1, (stage.width - STAGE_PADDING * 2) / boxWidth, (stage.height - STAGE_PADDING * 2) / boxHeight)
        : 1;
    const minZoom = Math.min(MIN_ZOOM, fit);
    const zoom = view.zoom === "fit" ? fit : view.zoom;
    const percent = Math.round(zoom * 100);

    // Track the stage size so "fit" follows window resizes and fullscreen.
    useEffect(() => {
        const element = stageRef.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => setStage({width: entry.contentRect.width, height: entry.contentRect.height}));
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const frame = frameRef.current;
        const onFullscreenChange = () => setIsFullscreen(frame !== null && document.fullscreenElement === frame);
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", onFullscreenChange);
            if (frame && document.fullscreenElement === frame) document.exitFullscreen().catch(() => undefined);
        };
    }, []);

    /** Pointer position relative to the stage center, the origin the image transform is expressed in. */
    const toStage = (clientX: number, clientY: number): Point => {
        const rect = stageRef.current?.getBoundingClientRect();
        return rect ? {x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2} : {x: 0, y: 0};
    };

    /** Zooms so the image point under `anchor` stays put. */
    const zoomTo = (nextZoom: number, anchor: Point = {x: 0, y: 0}) => {
        setView(current => {
            const from = current.zoom === "fit" ? fit : current.zoom;
            const to = clamp(nextZoom, minZoom, MAX_ZOOM);
            const scale = to / from;
            return {...current, zoom: to, x: anchor.x - (anchor.x - current.x) * scale, y: anchor.y - (anchor.y - current.y) * scale};
        });
    };

    const fitToScreen = () => setView(current => ({...current, zoom: "fit", x: 0, y: 0}));
    const reset = () => setView({zoom: "fit", rotation: 0, x: 0, y: 0});
    const rotate = (degrees: number) => setView(current => ({...current, rotation: current.rotation + degrees, x: 0, y: 0}));
    const toggleFullscreen = (trigger: HTMLElement) => {
        const request = document.fullscreenElement
            ? document.exitFullscreen()
            : trigger.closest<HTMLElement>(".iv-frame")?.requestFullscreen();
        request?.catch(error => console.warn("Fullscreen request failed:", error));
    };

    // Wheel zoom needs a non-passive listener to stop the page from scrolling.
    const onWheel = useEffectEvent((event: WheelEvent) => {
        event.preventDefault();
        zoomTo(zoom * Math.exp(-event.deltaY * 0.0015), toStage(event.clientX, event.clientY));
    });
    useEffect(() => {
        const element = stageRef.current;
        if (!element) return;
        const listener = (event: WheelEvent) => onWheel(event);
        element.addEventListener("wheel", listener, {passive: false});
        return () => element.removeEventListener("wheel", listener);
    }, []);

    const startGesture = () => {
        const points = [...pointers.current.values()];
        const origin = {x: view.x, y: view.y};
        if (points.length >= 2) {
            gesture.current = {kind: "pinch", startDistance: distance(points[0], points[1]), startZoom: zoom, startMid: midpoint(points[0], points[1]), origin};
        } else if (points.length === 1) {
            gesture.current = {kind: "pan", start: points[0], origin};
        } else {
            gesture.current = null;
        }
        setIsGesturing(gesture.current !== null);
    };

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        pointers.current.set(event.pointerId, toStage(event.clientX, event.clientY));
        // Freeze "fit" into a number so panning keeps the current scale.
        setView(current => current.zoom === "fit" ? {...current, zoom: fit} : current);
        startGesture();
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!pointers.current.has(event.pointerId)) return;
        pointers.current.set(event.pointerId, toStage(event.clientX, event.clientY));
        const active = gesture.current;
        const points = [...pointers.current.values()];
        if (active?.kind === "pan" && points.length === 1) {
            setView(current => ({...current, x: active.origin.x + points[0].x - active.start.x, y: active.origin.y + points[0].y - active.start.y}));
        } else if (active?.kind === "pinch" && points.length >= 2) {
            const mid = midpoint(points[0], points[1]);
            const nextZoom = clamp(active.startZoom * distance(points[0], points[1]) / active.startDistance, minZoom, MAX_ZOOM);
            const scale = nextZoom / active.startZoom;
            setView(current => ({
                ...current,
                zoom: nextZoom,
                x: mid.x - (active.startMid.x - active.origin.x) * scale,
                y: mid.y - (active.startMid.y - active.origin.y) * scale,
            }));
        }
    };

    const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
        if (!pointers.current.delete(event.pointerId)) return;
        startGesture();
    };

    const onDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
        if (view.zoom === "fit" || Math.abs(zoom - fit) < 0.01) zoomTo(1, toStage(event.clientX, event.clientY));
        else fitToScreen();
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
        if (event.target instanceof HTMLInputElement) return;
        if (event.key === "+" || event.key === "=") zoomTo(zoom * ZOOM_STEP);
        else if (event.key === "-") zoomTo(zoom / ZOOM_STEP);
        else if (event.key === "0") reset();
        else if (event.key === "r") rotate(90);
        else if (event.key === "R") rotate(-90);
        else return;
        event.preventDefault();
    };

    const tools: {label: string; icon: IconDefinition; onClick: (event: MouseEvent<HTMLButtonElement>) => void; disabled?: boolean}[] = [
        {label: "Fit to screen", icon: faDownLeftAndUpRightToCenter, onClick: fitToScreen},
        {label: "Zoom out", icon: faMagnifyingGlassMinus, onClick: () => zoomTo(zoom / ZOOM_STEP), disabled: zoom <= minZoom + 0.001},
        {label: "Zoom in", icon: faMagnifyingGlassPlus, onClick: () => zoomTo(zoom * ZOOM_STEP), disabled: zoom >= MAX_ZOOM - 0.001},
        {label: "Rotate left", icon: faRotateLeft, onClick: () => rotate(-90)},
        {label: "Rotate right", icon: faRotateRight, onClick: () => rotate(90)},
        {label: "Reset", icon: faHouse, onClick: reset},
        // Hidden where element fullscreen is unavailable (e.g. iPhone Safari) instead of showing a dead button.
        ...(canFullscreen ? [{
            label: isFullscreen ? "Exit fullscreen" : "Fullscreen",
            icon: isFullscreen ? faCompress : faExpand,
            onClick: (event: MouseEvent<HTMLButtonElement>) => toggleFullscreen(event.currentTarget),
        }] : []),
    ];

    return createPortal(<dialog ref={dialogRef} className="image-viewer" aria-label={`${title}, full size`} onKeyDown={onKeyDown}>
        <div className="iv-frame" ref={frameRef}>
            <div
                ref={stageRef}
                className={isGesturing ? "iv-stage is-gesturing" : "iv-stage"}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={onPointerEnd}
                onDoubleClick={onDoubleClick}
            >
                <img
                    className={natural ? "iv-image" : "iv-image is-loading"}
                    src={src}
                    alt={title}
                    draggable={false}
                    onLoad={event => setNatural({width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight})}
                    style={{
                        width: natural?.width,
                        height: natural?.height,
                        transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) rotate(${view.rotation}deg) scale(${zoom})`,
                    }}
                />
                {!natural && <p className="iv-loading" role="status">Loading…</p>}
            </div>

            <p className="iv-chip" aria-live="polite">
                <span className="iv-chip-dot" aria-hidden="true"/>
                {natural ? `${imageFormat(src)} · ${natural.width} × ${natural.height} · ${percent}%` : "Loading…"}
            </p>

            <button type="button" className="gx-btn gx-icon-btn iv-close" onClick={onClose} aria-label="Close viewer">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <div className="iv-toolbar" role="toolbar" aria-label="Image controls">
                {tools.map(tool =>
                    <button
                        key={tool.label}
                        type="button"
                        className="gx-btn iv-tool"
                        onClick={tool.onClick}
                        disabled={tool.disabled}
                        aria-label={tool.label}
                        title={tool.label}
                    >
                        <FontAwesomeIcon icon={tool.icon}/>
                    </button>
                )}
                <span className="iv-divider" aria-hidden="true"/>
                <input
                    className="iv-slider"
                    type="range"
                    min={Math.round(minZoom * 100)}
                    max={MAX_ZOOM * 100}
                    step={1}
                    value={percent}
                    onChange={event => zoomTo(Number(event.target.value) / 100)}
                    aria-label="Zoom level"
                    aria-valuetext={`${percent}%`}
                />
                <span className="iv-percent">{percent}%</span>
            </div>
        </div>
    </dialog>, document.body);
}
