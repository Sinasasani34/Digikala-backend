const { StatusCodes } = require("http-status-codes");
const { User, Otp } = require("../user/user.model");
const createHttpError = require("http-errors");
const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../user/refreshToken.model");

config();
async function sendOtpHandler(req, res, next) {
    try {
        const { mobile } = req.body;
        let code = Math.floor(Math.random() * 99999 - 10000) + 10000;

        let user = await User.findOne({
            where: { mobile }
        });
        let otp = null;
        if (!user) {
            user = await User.create({
                mobile
            })
            otp = await Otp.create({
                code,
                expires_in: new Date(Date.now() + 1000 * 60),
                userId: user.id
            })
            return res.status(StatusCodes.OK).json({
                message: "otp send successfully",
                data: {
                    code
                }
            })
        } else {
            otp = await Otp.findOne({ where: { userId: user?.id } })
            otp.code = code;
            otp.expires_in = new Date(Date.now() + 1000 * 60);
            await otp.save()
            return res.status(StatusCodes.OK).json({
                message: "otp send successfully",
                data: {
                    code
                }
            })
        }
    } catch (error) {
        console.log(error)
        next(next)
    }
}
async function checkOtpHandler(req, res, next) {
    try {
        const { mobile, code } = req.body;

        let user = await User.findOne({
            where: { mobile },
            include: [
                { model: Otp, as: "otp" }
            ]
        });
        if (!user) {
            throw createHttpError(401, "حساب کاربری یافت نشد")
        }

        if (user?.otp?.code !== code) {
            throw createHttpError(401, "کد یکبار مصرف ارسال شده نامعتبر است")
        }
        if (user?.otp?.expires_in < new Date()) {
            throw createHttpError(401, "کد ارسال شده منقضی شده است")
        }
        const { accessToken, refreshToken } = generateTokens({ userId: user.id });

        return res.json({
            message: "ورود با موفقیت انجام شد",
            accessToken,
            refreshToken
        })
    } catch (error) {
        console.log(error)
        next(next)
    }
}

async function verifyRefreshTokenHandler(req, res, next) {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            throw createHttpError(401, "وارد حساب کاربری خود شوید");
        }
        const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        if (verified?.userId) {
            const user = await User.findByPk(verified?.userId);
            if (!user) {
                throw createHttpError(401, "وارد حساب کاربری خود شوید");
            }
            const existToken = await RefreshToken.findOne({
                where: {
                    token
                }
            });
            if (existToken) throw createHttpError(401, "Token expired");
            await RefreshToken.create({
                token,
                userId: user.id
            })
            const { accessToken, refreshToken } = generateTokens({ userId: user.id });
            return res.json({
                accessToken,
                refreshToken,
            })
        }
    } catch (error) {
        next(error);
    }
}

function generateTokens(payload) {
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
    })
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "30d"
    })
    return {
        accessToken,
        refreshToken
    }
}

module.exports = {
    sendOtpHandler,
    checkOtpHandler,
    verifyRefreshTokenHandler
}