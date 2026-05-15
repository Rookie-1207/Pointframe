// Entrypoint module: composes analytics and UI behaviors for the homepage.
import { createAnalytics } from "./analytics.js";
import { initCopyCommand } from "./copy-command.js";

const { trackEvent } = createAnalytics();
initCopyCommand(trackEvent);
