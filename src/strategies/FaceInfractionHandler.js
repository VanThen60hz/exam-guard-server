class FaceInfractionHandler {
    static handleUpdate(statistic) {
        return { faceDetectionCount: statistic.faceDetectionCount + 1 };
    }

    static getInitialData() {
        return { faceDetectionCount: 1 };
    }
}

module.exports = FaceInfractionHandler;
