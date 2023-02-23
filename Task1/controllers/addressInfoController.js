const getInfoService = require('../services/getInfo')

class AddressInfoController {

    async getInfo(req, res) {
        const {walletaddress} = req.body
        const result = await getInfoService.getTokenBalance(walletaddress)
        res.json(result)
    }
}

module.exports = new AddressInfoController()