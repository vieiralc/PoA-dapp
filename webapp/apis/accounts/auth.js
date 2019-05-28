const Web3 = require("web3");
const axios = require("axios");
const lodash = require("lodash");

const allAccountsInfo = require('../../utils/parityRequests').allAccountsInfoRequest;
const httpEndpoint = require('../../utils/nodesEndPoints').node00Endpoint;
const headers = require('../../utils/parityRequests').headers;

const web3 = new Web3(httpEndpoint);

function renderIndex(req, res) {
    if (req.session.username) {
        res.redirect("/dashboard");
        res.end();
    } else {
        res.render('index.html');
        res.end();
    }
}

function renderRegister(req, res) {
    if (req.session.username) {
        res.redirect('/dashboard');
        res.end();
    } else {
        res.render('register.html');
        res.end();
    }
}

function renderDashboard(req, res) {
    if (req.session.username) {
        res.render('dashboard.html');
        res.end();
    } else {
        res.redirect('/');
        res.end();
    }
}

async function register(req, res) {
    console.log("*** REGISTER ***");
    console.log(req.body);

    let name = req.body.username;
    let pass = req.body.password;
    let accountAddress;
}

function logout(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } 

        res.redirect("/");
    });
}

async function login(req, res) {
    console.log("*** LOGIN ***", req.body);

    // pega nome de usuário e senha
    let user = req.body.username;
    let pass = req.body.password;
    
    // envia requisão ao parity e cria um array de contas
    let accounts = [];
    await axios.post(httpEndpoint, allAccountsInfo, { headers })
        .then(function(response) {
            lodash.forEach(response.data.result, function (value, key) {
                accounts.push({ userName: value.name, userAddr: key })
            });
        })
        .catch(function(error) {
            return res.send({ "error": true, "msg": "Usuario nao encontrado" });
        });

    // filtra as contas para selecionar
    // a conta que deseja realizar o login
    let u = accounts.filter(obj => {
        return obj.userName === user;
    });

    // verifica se a conta foi encontrada
    let userAddr;
    if (u.length === 0) {
        return res.send({ "error": true, "msg": "Nome de usuário incorreto." });
    } else {
        userAddr = u[0].userAddr;
    }

    // se o parity desbloquear a conta 
    // então o nome de usuário e senha estão corretos
    // e o login é realizado com sucesso
    await web3.eth.personal.unlockAccount(userAddr, pass, null)
        .then(function(result) {
            console.log(result);
            console.log("Account unlocked!");
            req.session.username = user;
            req.session.password = pass;
            req.session.address  = userAddr;
            console.log(req.session.username);
            return res.status(200).json({ error: false, userData: { name: user, address: userAddr } })
        })
        .catch(function(error) {
            console.log("Failed to unlock account!");
            console.log(error);
            return res.send({ "error": true, "msg": "Senha incorreta." });
        });
}

module.exports = { renderIndex, renderRegister, renderDashboard, logout, login };