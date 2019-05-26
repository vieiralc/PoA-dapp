const path = require('path');
const Web3 = require("web3");
const axios = require("axios");
const lodash = require("lodash");
const atob = require("atob");

const product_abi = require(path.resolve("../dapp/build/contracts/MyContract.json"));
const httpEndpoint = 'http://localhost:8450';

let contractAddress = '0xe99789A2367F08fEB5ba9553bA54C14C63Ccb583';

let web3 = new Web3(httpEndpoint);
let MyContract = new web3.eth.Contract(product_abi.abi, contractAddress);

module.exports = {
    getProducts: async function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            
            res.render('produtos.html');

        }
    }
}