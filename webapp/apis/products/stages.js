const path = require('path');
const Web3 = require('web3');

const product_abi = require(path.resolve("../dapp/build/contracts/MyContract.json"));
const httpEndpoint = 'http://localhost:8540';

let contractAddress = '0xe99789A2367F08fEB5ba9553bA54C14C63Ccb583';

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

let web3 = new Web3(httpEndpoint, null, OPTIONS);
let MyContract = new web3.eth.Contract(product_abi.abi, contractAddress);

function renderAddStage(req, res) {

    // verifica se usuario esta logado
    if (!req.session.username) {
        res.redirect('/');
        res.end();
    } else {
        res.render('stages.html');
    }
}

async function addStage(req, res) {
    
    console.log("*** products -> productsApi -> addProductToStage ***");
    console.dir(req.body);

    let productsIds = [];
    let stageDesc = req.body.StageDesc;
    let userAddr = req.session.address;
    let pass = req.session.password;

    // converter ids dos produtos para inteiro
    for (let i = 0; i < req.body.productsIds.length; i++) {
        let productId = parseInt(req.body.productsIds[i], 10);
        productsIds.push(productId);
    }

    console.log(userAddr, productsIds, stageDesc);
    
    // unlock account
    await web3.eth.personal.unlockAccount(userAddr, pass, null)
        .then(async result => {
            console.log("Conta desbloqueada: ", result);
            // salvar etapa no contrato
            await MyContract.methods.addToStage(productsIds, stageDesc)
                .send({ from: userAddr, gas: 3000000 })
                .then(response => {
                    console.log("etapa registrada com sucesso");
                    console.log(response);
                    res.send({ error: false, msg: "Etapa registrada com sucesso"});        
                })
                .catch(err => {
                    console.log("*** ERROR: products -> productsApi -> addProductToStage ***");
                    console.log(err);
                    res.send({ error: true, msg: "Erro ao registrar etapa. Por favor, tente novamente mais tarde."});
                })
        })
        .catch(err => {
            console.log("*** ERROR: products -> productsApi -> addProductToStage ***");
            console.log(err);
            res.send({ error: true, msg: "Erro ao desbloquear a conta. Por favor, tente novamente mais tarde."});
        })

}

module.exports = {
    renderAddStage,
    addStage
}