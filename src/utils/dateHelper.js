const addSevenHours = (date) => {
    if (date) {
        return new Date(date.getTime() + 7 * 60 * 60 * 1000);
    }
    return date;
};

const addTimestampsMiddleware = (schema) => {
    schema.pre("save", function (next) {
        if (this.isNew) {
            this.createdAt = addSevenHours(this.createdAt || new Date());
            this.timeDetected = addSevenHours(this.timeDetected || new Date());
        }
        this.updatedAt = addSevenHours(new Date());
        next();
    });

    schema.pre("findOneAndUpdate", function (next) {
        const update = this.getUpdate();
        if (update.$set && update.$set.updatedAt) {
            update.$set.updatedAt = addSevenHours(new Date(update.$set.updatedAt));
        } else {
            this.set({ updatedAt: addSevenHours(new Date()) });
        }
        next();
    });

    schema.pre("updateOne", function (next) {
        this.set({ updatedAt: addSevenHours(new Date()) });
        next();
    });
};

module.exports = { addSevenHours, addTimestampsMiddleware };
