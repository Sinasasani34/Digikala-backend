const { config } = require("dotenv");
const { User } = require("../user/user.model");
const jwt = require('jsonwebtoken');
const createHttpError = require("http-errors");

config();
async function AuthGuard(req, res, next) {
    try {
        const authorization = req.headers?.authorization ?? undefined;

        if (!authorization) throw createHttpError(401, "وارد حساب کاربری خود شوید");
        const [bearer, token] = authorization?.split(" ");
        if (!bearer || bearer?.toLowerCase() !== "bearer") throw createHttpError(401, "وارد حساب کاربری خود شوید");
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (verified?.userId) {
            const user = await User.findByPk(verified?.userId);
            if (!user) {
                throw createHttpError(401, "وارد حساب کاربری خود شوید");
            }
            req.user = {
                id: user.id,
                mobile: user?.mobile,
                fullname: user?.fullname,
            }
            return next();
        }
        throw createHttpError(401, "وارد حساب کاربری خود شوید");
    } catch (error) {
        next(error);
    }
}

module.exports = {
    AuthGuard
}