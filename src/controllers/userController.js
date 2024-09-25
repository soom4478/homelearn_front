const { userService } = require("../services")
const { asyncWrap } = require("../middleware/errorControl");

const signInKakao = asyncWrap(async (req, res) => {
    const headers = req.headers["authorization"];
    const kakaoToken = headers.split(" ")[1];

    const accessToken = await userService.signInKakao(kakaoToken);
    
    return res.status(200).json({ accessToken: accessToken });
});

module.exports = {
    signInKakao
}

const headers = req.headers["authorization"];
const kakaoToken = headers.split(" ")[1];