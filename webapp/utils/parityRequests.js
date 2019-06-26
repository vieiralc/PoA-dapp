const path = require('path');
const Web3 = require('web3');

const node00Endpoint = require('./nodesEndPoints').node00Endpoint;

const allAccountsInfoRequest = { 
    "method": "parity_allAccountsInfo", 
    "params": [], 
    "id": 1, 
    "jsonrpc": "2.0" 
};

const OPTIONS = {
    defaultBlock: 'latest',
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const headers = { 'Content-Type': 'application/json' };
const ownerAccount = "0x00a1103c941fc2e1ef8177e6d9cc4657643f274b";
const MyContractJson = require(path.resolve('../dapp/build/contracts/MyContract.json'));
const contractAbi = MyContractJson.abi;
const network = MyContractJson['networks']
const contractAddress = network['8995'].address;

const web3 = new Web3(node00Endpoint, null, OPTIONS);
const MyContract = new web3.eth.Contract(contractAbi, contractAddress);

function newAccountRequest(name, pass) {
    let newAccountRequest = { "method": "parity_newAccountFromPhrase", "params": [name, pass], "id": 1, "jsonrpc": "2.0" };
    return newAccountRequest;
}

function setAccountNameRequest(accountAddress, name) {
    let setAccountNameRequest = { "method": "parity_setAccountName", "params": [accountAddress, name], "id": 1, "jsonrpc": "2.0" };
    return setAccountNameRequest; 
}

module.exports = {
    allAccountsInfoRequest,
    newAccountRequest,
    setAccountNameRequest,
    headers,
    ownerAccount,
    contractAddress,
    web3,
    MyContract
}