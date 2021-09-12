const artifacts = require('../build/contracts/CheckDot.json')
const contract = require('@truffle/contract')
const Web3 = require('web3');

// initialize Web3
const web3 = new Web3('ws://localhost:7545');

const CheckDot = contract(artifacts);
CheckDot.setProvider(web3.currentProvider);

const getDecimalsAmount = (amount) => {
    return amount * (10 ** 18).toFixed()
};

const logError = (prefix) => {
    return (e) => {
        console.log(`Contract ${prefix} error :`, e);
    };
};

// Test Allowance with CheckDot Contract
web3.eth.getAccounts().then((accounts) => {
    web3.eth.defaultAccount = accounts[0];
    console.log(`Default Account ${web3.eth.defaultAccount}`);
    CheckDot.deployed().then((deployedContract) => {
        const amountAllowance = getDecimalsAmount(10).toString();
        console.log(amountAllowance);
        deployedContract.increaseAllowance("0x67D82A74544AAC2199764B7e12e8ab6F4db84F2E", amountAllowance, {from: accounts[0]}).then((res) => {
            console.log(res);
        }).catch(logError("IncreaseAllowance"));
    }).catch(logError("GetContract"));
}).catch(logError("GetAccounts"));