const { userDao } = require("../models");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const signInKakao = async (kakaoToken) => {
    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${kakaoToken}`,
        },
    });
    const {data} = result
    const name = data.properties.nickname;
    const email = data.kakao_account.email;
    const kakaoId = data.id;
    const profileImage = data.properties.profile_image;

    if (!name || !email || !kakaoId) throw new error("KEY_ERROR", 400);

    const user = await userDao.getUserById(kakaoId);

    if (!user) {
        await userDao.signUp(email, name, kakaoId, profileImage);
    }

    return jwt.sign({ kakao_id: user[0].kakao_id }, process.env.TOKKENSECRET);
    
};

module.exports = {
    signInKakao
}


const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
        Authorization: `Bearer ${kakaoToken}`,
    },
});

const {data} = result
const name = data.properties.nickname;
const email = data.kakao_account.email;
const kakaoId = data.id;
const profileImage = data.properties.profile_image;

if (!name || !email || !kakaoId) throw new error("KEY_ERROR", 400);

const user = await userDao.getUserById(kakaoId);

if (!user) {
        await userDao.signUp(email, name, kakaoId, profileImage);
    }

return jwt.sign({ kakao_id: user[0].kakao_id }, process.env.TOKKENSECRET);