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
    renderPage: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            res.render('produtos.html');
        }
    },
    getProducts: async function(req, res) {
        let produtos = [{id: 1, produto: 'produto 01', preco: '1000'}, {id: 2, produto: 'produto 02', preco: '2000'}, 
            {id: 3, produto: 'produto 02', preco: '3000'}]
        res.send({ error: false, msg: "produtos resgatados com sucesso", produtos});
    },
    addProducts: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** ProductsApi -> AddProducts ***");
            console.log(req.body);

            return res.status(200).json({ 'error': false, 'msg': 'Produto cadastrado com sucesso.'});
        }
        
    }
}