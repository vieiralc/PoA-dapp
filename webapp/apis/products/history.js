const web3 = require('../../utils/parityRequests').web3;
const MyContract = require('../../utils/parityRequests').MyContract;

function renderAddHistory (req, res) {
    // verifica se usuario esta logado
    if (!req.session.username) {
        res.redirect('/api/auth');
        res.end();
    } else {
        res.render('historico.html');
    }
}

function renderGetHistory (req, res) {
    // verifica se usuario esta logado
    if (!req.session.username) {
        res.redirect('/api/auth');
        res.end();
    } else {
        res.render('listaHistorico.html');
    }
}

async function addHistory (req, res) {

    if (!req.session.username) {
        res.redirect('/');
        res.end();
    } else {
        console.log("*** Apis -> products -> history: ***");
        console.log(req.body);
        
        let dates = [];
        let stages = [];

        const { productId, stage, date } = req.body;
        const userAddr = req.session.address;
        dates.push(date);
        stages.push(stage);
        let pass = req.session.password;
        
        try {
            let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
            if (accountUnlocked) {

                await MyContract.methods.addNewHistory(productId, stages, dates)
                    .send({ from: userAddr, gas: 3000000 })
                    .then(function(result) {
                        console.log(result);
                        return res.send({ 'error': false, 'msg': 'Histórico cadastrado com sucesso.'});  
                    })
                    .catch(function(err) {
                        console.log(err);
                        return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                    })
            }
        } catch(err) {
            return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
        }
        
    }
}

async function getHistory (req, res) {

    if (!req.session.username) {
        res.redirect('/');
        res.end();
    } else {
        let userAddr = req.session.address;
        console.log("*** Getting history ***");

        await MyContract.methods.getHistories()
            .call({ from: userAddr, gas: 3000000 })
            .then(async function (his) {
                console.log("his", his);

                let historiesArray = [];
                for (let i = 0; i < his['0'].length; i++) {
                    let historyObj = {};

                    historyObj.product = his['0'][i];
                    historyObj.stage = his['1'][i]
                    historyObj.dates = his['2'][i];
                    historyObj.owner = his['3'][i];

                    historiesArray.push(historyObj);
                }

                console.log(historiesArray);
                res.send({ error: false, msg: 'Histórico resgatado com sucesso', historiesArray });
            })
            .catch(error => {
                console.log("*** apis -> products -> history -> getHistory ERROR: ***", error);
                res.send({ error: true, msg: error});
            })
    }
}

module.exports = {
    renderAddHistory,
    renderGetHistory,
    addHistory,
    getHistory
}