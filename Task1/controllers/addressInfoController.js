const getInfoService = require('../services/getInfo')

class AddressInfoController {

    async getInfo(req, res) {
        const {walletAddress} = req.body
        const result = await getInfoService.getTokenBalance(walletAddress)
        res.json(result)
    }
}

module.exports = new AddressInfoController()