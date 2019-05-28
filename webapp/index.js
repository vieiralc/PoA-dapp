const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const axios = require('axios');
const lodash = require('lodash');

const httpEndpoint = require('./utils/nodesEndPoints').node00Endpoint;
const web3 = new Web3(httpEndpoint);
const headers = require('./utils/parityRequests').headers;
const PORT = process.env.PORT || 3000;

const ownerAccount = "0x00a1103c941fc2e1ef8177e6d9cc4657643f274b";

const allAccountsInfo = require('./utils/parityRequests').allAccountsInfoRequest;
const parityRequest = require('./utils/parityRequests');

const contract_abi = require("../dapp/build/contracts/MyContract.json");
const contractAdress = "0x2535Dfea21215cF30bC3716A6EC4442942E32f56";

const products_api = require("./apis/products/productsApi.js");
const auth = require("./apis/accounts/auth.js");

const MyContract = new web3.eth.Contract(contract_abi.abi, contractAdress);

const app = express();

// set default views folder
app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// registra a sessão do usuário
app.use(session({
    secret: 'mysecret',
    saveUninitialized: false,
    resave: false
}));

// @route  GET /
// @desc   renders index
// @access Public
app.get('/', auth.renderIndex);

// @route  GET /register
// @desc   renders register
// @access Public
app.get('/register', auth.renderRegister);

// @route  GET /dashboard
// @desc   renders dashboard
// @access Private
app.get('/dashboard', auth.renderDashboard);

// @route  GET /logout
// @desc   logs out user
// @access Private
app.get('/logout', auth.logout);

// @route  POST /login
// @desc   logs in user
// @access Public
app.post('/login', auth.login);

// @route  POST /register
// @desc   logs in user
// @access Public
app.post('/register', async function(req, res) {
    console.log("*** REGISTER ***");
    console.log(req.body);
    
    let name = req.body.username;
    let pass = req.body.password;
    let accountAddress;

    // cria requisição a ser enviada ao parity
    let newAccountRequest = parityRequest.newAccountRequest(name, pass);

    // cria a conta no parity e salva email no contrato
    try {
        // retorna endereço do usuário
        let NewAccountResponse = await axios.post(httpEndpoint, newAccountRequest, { 'headers': headers });
        accountAddress = NewAccountResponse.data.result;
        console.log("Account created " + JSON.stringify(NewAccountResponse.data.result));

        // Registra o nome da conta de usuário no parity
        let setAccountNameRequest = { "method": "parity_setAccountName", "params": [accountAddress, name], "id": 1, "jsonrpc": "2.0" };
        let setAccountNameResponse = await axios.post(httpEndpoint, setAccountNameRequest, { 'headers': headers });
        console.log("Account name setup status: %s", JSON.stringify(setAccountNameResponse.data.result));

        res.status(200).json({ 'error': false, 'msg': 'Conta criada com sucesso.'});

        // Desbloqueia a conta do usuário para salvar seus dados
        // Ex: email
        let unlockResponse = await web3.eth.personal.unlockAccount(accountAddress, pass, null);
        console.log("*** Unlock response ***", unlockResponse);

        if (unlockResponse) {

            // tranfere 1 ether para a conta do usuário
            let sendFundsResponse;
            
            await web3.eth.sendTransaction({from: ownerAccount, to: accountAddress, value: "0xDE0B6B3A7640000"})
                .then(receipt => {
                    console.log("", receipt);
                    sendFundsResponse = true;
                })

            console.log("*** sendFundsResponse ***", sendFundsResponse);

            if (sendFundsResponse) {
                MyContract.methods.setUser(accountAddress, "email@gmail.com")
                    .send({ from: accountAddress, gas: 3000000 })
                    .then(function(result) {
                        console.log("*** Usuário registrado ***");
                        return res.end();
                    })
                    .catch(function (error) {
                        console.log("+++ Erro ao salvar e-mail +++");
                        console.log(error);
                        return res.send({ 'error': true, 'msg': 'Erro ao criar e-mail.'});
                    })
            } else {
                return res.send({ 'error': true, 'msg': 'Erro ao transferir fundos.'});
            }

        } else {
            return res.send({ 'error': true, 'msg': 'Erro ao desbloquear a conta.'});
        }

    } catch (error) {
        console.log("Account name setup failed: %s", error);
        return res.send({ 'error': true, 'msg': error });
    }

})

// * Página de produtos * //
app.get("/addProducts", products_api.renderAddProducts);
app.get("/getProducts", products_api.renderGetProducts);

app.post("/addProducts", products_api.addProducts);
app.get("/listProducts", products_api.listProducts);

// * Adicionar produtos a uma etapa * //
app.post("/addToStage", products_api.addProductToStage);

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})