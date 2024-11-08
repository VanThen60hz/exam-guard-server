class ScreenCaptureInfractionHandler {
    static handleUpdate(statistic) {
        return { screenCaptureCount: statistic.screenCaptureCount + 1 };
    }

    static getInitialData() {
        return { screenCaptureCount: 1 };
    }
}

module.exports = ScreenCaptureInfractionHandler;
