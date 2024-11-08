const FaceInfractionHandler = require("./FaceInfractionHandler");
const SwitchTabInfractionHandler = require("./SwitchTabInfractionHandler");
const ScreenCaptureInfractionHandler = require("./ScreenCaptureInfractionHandler");

const infractionHandlers = {
    Face: FaceInfractionHandler,
    "Switch Tab": SwitchTabInfractionHandler,
    "Screen Capture": ScreenCaptureInfractionHandler,
};

function getInfractionHandler(type) {
    const handler = infractionHandlers[type];
    if (!handler) {
        throw new Error("Invalid infraction type");
    }
    return handler;
}

module.exports = {
    getInfractionHandler,
};
