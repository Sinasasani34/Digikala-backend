const { default: axios } = require("axios");
const { config } = require("dotenv");
const createHttpError = require("http-errors");
config();
// https://sandbox.zarinpal.com/pg/v4/payment/request.json
async function zarinpalRequest(amount, user, description = 'خرید محصول') {
    const result = await axios.post("https://sandbox.zarinpal.com/pg/v4/payment/request.json", {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_CALLBACK_URL,
        amount,
        description,
        metadata: {
            email: 'example@gmail.com',
            mobile: user?.mobile
        },
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.data).catch(err => {
        return err
    });
    if (result?.data?.authority) {
        return {
            authority: result?.data?.authority,
            payment_url: `${process.env.ZARINPAL_GATEWAY_URL}/${result?.data?.authority}`
        }
    }
    throw createHttpError(400, "سرویس زرینپال در دسترس نمیباشد")
}

async function zarinpalVerify(amount, authority) {
    const result = await axios.post("https://sandbox.zarinpal.com/pg/v4/payment/verify.json", {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        authority,
        amount: amount * 10,
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.data)
        .catch(err => {
            return err
        });

    if (result?.data?.code == 100) {
        return result?.data;
    } else if (result?.data?.code == 101) {
        throw createHttpError(409, "پرداخت در حال حاضر تایید شده است");
    }
    throw createHttpError(500, "something is wrong!");
}

module.exports = {
    zarinpalRequest,
    zarinpalVerify
}