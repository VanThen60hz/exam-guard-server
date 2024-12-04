"use strict";

const { Types } = require("mongoose");

const _ = require("lodash");

const convertToObjectIdMongodb = (id) => Types.ObjectId.createFromHexString(id);

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

module.exports = {
    getInfoData,
    convertToObjectIdMongodb,
};
