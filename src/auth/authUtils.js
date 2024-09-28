"use strict";

const JWT = require("jsonwebtoken");

const { asyncHandler } = require("../helpers/asyncHandler");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const { findUserByUserId } = require("../repositories/user.repository");
const roles = require("../constants/roles");
const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = JWT.sign(payload, publicKey, {
            // algorithm: "RS256",
            expiresIn: "2 days",
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            // algorithm: "RS256",
            expiresIn: "7 days",
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verify accessToken: ${err}`);
            } else {
                // console.log(`Decoded accessToken: ${JSON.stringify(decode, null, 2)}`);
                console.log(`Decoded accessToken: ${decode}`);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
};

const authenticationV2 = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new UnauthorizedError("Unauthorized");
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore");
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw new UnauthorizedError("Invalid Token");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw new UnauthorizedError("Unauthorized");
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError("Unauthorized");
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new UnauthorizedError("Invalid Token");
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw new UnauthorizedError("Unauthorized");
    }
});

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new UnauthorizedError("Unauthorized");
    console.log("userId: ", userId);
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore");
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError("Unauthorized");
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new UnauthorizedError("Invalid Token");
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw new UnauthorizedError("Unauthorized");
    }
});

const adminAuthentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    console.log("userId: ", userId);
    if (!userId) throw new UnauthorizedError("Unauthorized");

    const user = await findUserByUserId(userId);
    if (user.role !== roles.ADMIN) throw new UnauthorizedError("Unauthorized");

    console.log("userId: ", userId);
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore");
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError("Unauthorized");
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new UnauthorizedError("Invalid Token");
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw new UnauthorizedError("Unauthorized");
    }
});

const verifyJWT = async (token, keySecret) => {
    return JWT.verify(token, keySecret);
};

module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    adminAuthentication,
    verifyJWT,
};
