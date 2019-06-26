const web3 = require('../../utils/parityRequests').web3;
const MyContract = require('../../utils/parityRequests').MyContract; 

function renderAddProducts (req, res) {

    // verifica se usuario esta logado
    if (!req.session.username) {
        res.redirect('/api/auth');
        res.end();
    } else {
        res.render('produtos.html');
    }
}

function renderGetProducts (req, res) {
    // verifica se usuario esta logado
    if (!req.session.username) {
        res.redirect('/api/auth');
        res.end();
    } else {
        res.render('listaProdutos.html');
    }
}

function renderEditProduct (req, res) {
    // verifica se usuario esta logado
    if (!req.session.username) {
        res.redirect('/api/auth');
        res.end();
    } else {
        res.render('editProduct.html');
    }
}

async function getProducts (req, res) {

    if (!req.session.username) {
        res.redirect('/api/auth');
        res.end();
    } else {

        let userAddr = req.session.address;
        console.log("*** Getting products ***", userAddr);

        await MyContract.methods.getProducts()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (prod) {

                console.log("prod", prod);
                if (prod === null) {
                    return res.send({ error: false, msg: "no products yet"});
                }

                let produtos = [];
                for (i = 0; i < prod['0'].length; i++) {
                    produtos.push({ 'id': +prod['0'][i], 'produto': prod['1'][i], 'addr': prod['2'][i], 'preco': +prod['3'][i] });
                }

                console.log("produtos", produtos);

                res.send({ error: false, msg: "produtos resgatados com sucesso", produtos});
                return true;
            })
            .catch(error => {
                console.log("*** productsApi -> getProducts ***error:", error);
                res.send({ error: true, msg: error});
            })
    }    
}

async function addProducts (req, res) {

    if (!req.session.username) {
        res.redirect('/');
        res.end();
    } else {
        console.log("*** ProductsApi -> AddProducts ***");
        console.log(req.body);

        let produto = req.body.produto;
        let preco   = req.body.preco;
        let userAddr = req.session.address;
        let pass     = req.session.password;

        try {
            let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
            if (accountUnlocked) {

                await MyContract.methods.addProduct(produto, preco)
                    .send({ from: userAddr, gas: 3000000 })
                    .then(function(result) {
                        console.log(result);
                        return res.send({ 'error': false, 'msg': 'Produto cadastrado com sucesso.'});  
                    })
                    .catch(function(err) {
                        console.log(err);
                        return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                    })
            } 
        } catch (err) {
            return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
        }
    }
}

async function updateProduct (req, res) {
        
    if (!req.session.username) {
        res.redirect('/');
        res.end();
    } else {
    
        let productId = req.body.productId;
        let newDesc   = req.body.newDesc;
        let newPrice  = req.body.newPrice;
        let userAddr  = req.session.address;
        let pass      = req.session.password;

        console.log("apis -> products -> updateProduct: ", userAddr, productId, newDesc, newPrice);

        try {
            let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
            console.log("Account unlocked?", accountUnlocked);
            if (accountUnlocked) {

                await MyContract.methods.updateProduct(productId, newDesc, newPrice)
                    .send({ from: userAddr, gas: 3000000 })
                    .then(receipt => {
                        console.log(receipt);
                        return res.send({ 'error': false, 'msg': 'Produto atualizado com sucesso.'}); 
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.json({ 'error': true, msg: "erro ao se comunar com o contrato"});
                    })
            }
        } catch (error) {
            return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
        }
    }
}

module.exports = {
    renderAddProducts,
    renderGetProducts,
    renderEditProduct,
    getProducts,
    addProducts,
    updateProduct    
}