const allAccountsInfoRequest = { 
    "method": "parity_allAccountsInfo", 
    "params": [], 
    "id": 1, 
    "jsonrpc": "2.0" 
};

const headers = { 'Content-Type': 'application/json' };

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
    headers
}