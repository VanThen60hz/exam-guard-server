class SwitchTabInfractionHandler {
    static handleUpdate(statistic) {
        return { tabSwitchCount: statistic.tabSwitchCount + 1 };
    }

    static getInitialData() {
        return { tabSwitchCount: 1 };
    }
}

module.exports = SwitchTabInfractionHandler;
