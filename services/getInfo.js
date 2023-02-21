const Web3 = require('web3');
const request = require('request');
const url = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';
let nameArray = []
let addressArray = []
const ethereum = "ethereum"

request({
    method: 'GET',
    url: url
}, function (error, response, body) {
    let platformsss;
    if (!error && response.statusCode == 200) {
        // в циклі for, межу ітератора потрібно прописати в ручну тому, що для не всіх адресів,
        // які ми дістаємо через coingecko API відпрацьовує web3.eth.Contract
        for (let i = 0; i < JSON.parse(body).length; i++) {
            platformsss = JSON.parse(body)[i].platforms
            if (Object.keys(platformsss).includes(ethereum)) {
                nameArray.push(JSON.parse(body)[i].name)
                addressArray.push(platformsss[ethereum])
            }
        }
    }
})

class CreateInfoService {
    async getTokenBalance(walletAddress) {
        const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/8bf70f7acfd3417aa1f492bcc28d6bc4'));

        const balanceOfABI = [{"constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];

        let finalResult = {}
        for (let i = 0; i< addressArray.length; i++) {
            const contract = new web3.eth.Contract(balanceOfABI, addressArray[i])

            const result = await contract.methods.balanceOf(walletAddress).call();

            const formattedResult = web3.utils.fromWei(result, "ether");
            if (!(formattedResult == 0)){
                finalResult[`${nameArray[i]}`] = formattedResult
            }
        }
        return {finalResult}
    }

}

module.exports = new CreateInfoService()