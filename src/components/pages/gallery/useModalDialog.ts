import {useEffectEvent, useLayoutEffect, useRef} from "react";

/**
 * Opens a native <dialog> as a modal while the component is mounted (focus trap, inert page, Esc).
 * Esc is routed to `onClose` so React state stays the single source of truth for visibility.
 */
export function useModalDialog(onClose: () => void) {
    const ref = useRef<HTMLDialogElement>(null);
    const handleCancel = useEffectEvent((event: Event) => {
        event.preventDefault();
        onClose();
    });

    // Layout effect: the cleanup's close() must run while the dialog is still attached,
    // so the browser returns focus to whatever opened it.
    useLayoutEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (!dialog.open) dialog.showModal();
        const onCancel = (event: Event) => handleCancel(event);
        dialog.addEventListener("cancel", onCancel);
        return () => {
            dialog.removeEventListener("cancel", onCancel);
            if (dialog.open) dialog.close();
        };
    }, []);

    return ref;
}
