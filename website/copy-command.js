// UI module: handles winget command copy interactions and related tracking events.
export function initCopyCommand(trackEvent) {
    const copyButton = document.getElementById("copy-command-button");
    const copyStatus = document.getElementById("copy-command-status");
    const command = "winget install DimitarRadenkov.Pointframe";

    if (!(copyButton instanceof HTMLButtonElement) || !(copyStatus instanceof HTMLElement)) {
        return;
    }

    const setStatus = (message, kind) => {
        copyStatus.textContent = message;
        copyStatus.className = kind ? `copy-status is-${kind}` : "copy-status";
    };

    const fallbackCopy = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.setAttribute("readonly", "readonly");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();

        const didCopy = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!didCopy) {
            throw new Error("Fallback copy failed.");
        }
    };

    copyButton.addEventListener("click", async () => {
        copyButton.disabled = true;
        setStatus("Copying command...", "");

        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                await navigator.clipboard.writeText(command);
            }
            else {
                fallbackCopy(command);
            }

            trackEvent("winget_command_copied", {
                cta_location: "hero",
                command
            });
            setStatus("Command copied to clipboard.", "success");
        }
        catch {
            try {
                fallbackCopy(command);
                trackEvent("winget_command_copied", {
                    cta_location: "hero",
                    command,
                    copied_via: "fallback"
                });
                setStatus("Command copied to clipboard.", "success");
            }
            catch {
                trackEvent("winget_command_copy_failed", {
                    cta_location: "hero",
                    command
                });
                setStatus("Could not copy automatically. Please copy the command manually.", "error");
            }
        }
        finally {
            window.setTimeout(() => {
                copyButton.disabled = false;
            }, 300);
        }
    });
}
