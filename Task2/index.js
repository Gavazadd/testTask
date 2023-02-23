const Web3 = require('web3');
const config = require("config")
const fs = require('fs');

const url = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';
const walletAddress = config.get("address")
const ethereum = "ethereum"
let nameArray = []
let addressArray = []
const fetch = require( 'cross-fetch');
let timerId = setTimeout(async function tick ()  {
    try {
        const date = new Date()
        const now = date.toLocaleString()
        const res = await fetch(url);

        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }

        const user = await res.json();
        let platformsss;
        for (let i = 0; i < user.length; i++) {
            platformsss = user[i].platforms
            if (Object.keys(platformsss).includes(ethereum)) {
                nameArray.push(user[i].name)
                addressArray.push(platformsss[ethereum])
            }
        }
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
        console.log(finalResult)
        console.log(now)
        fs.writeFileSync('data.json', JSON.stringify([finalResult, now]));

        timerId = setTimeout(tick, 60000); // (*)
    }catch (err) {
        console.error(err);
    }
}, 0);