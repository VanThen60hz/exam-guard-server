// Import các handler
const FaceInfractionHandler = require("./FaceInfractionHandler");
const SwitchTabInfractionHandler = require("./SwitchTabInfractionHandler");
const ScreenCaptureInfractionHandler = require("./ScreenCaptureInfractionHandler");

const infractionHandlers = {
    Face: FaceInfractionHandler,
    "Switch Tab": SwitchTabInfractionHandler,
    "Screen Capture": ScreenCaptureInfractionHandler,
};

function setInfractionHandler(type, handler) {
    if (
        typeof handler !== "object" ||
        typeof handler.handleUpdate !== "function" ||
        typeof handler.getInitialData !== "function"
    ) {
        throw new Error("Handler must be an object with 'handleUpdate' and 'getInitialData' methods");
    }
    infractionHandlers[type] = handler;
}

function getInfractionHandler(type) {
    const handler = infractionHandlers[type];
    if (!handler) {
        throw new Error(`Invalid infraction type: ${type}`);
    }
    return handler;
}

module.exports = {
    setInfractionHandler,
    getInfractionHandler,
};
