const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;

const authRoutes = require('./apis/routes//auth');
const productsRoutes = require('./apis/routes/products');
const historyRoutes = require('./apis/routes/history');
const stagesRoutes = require('./apis/routes/stages');

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

app.get('/', (req, res) => {
    res.redirect('/api/auth');
});

// * Auth pages * //
app.use("/api/auth", authRoutes);

// * Products pages * //
app.use(productsRoutes);

// * Estágios * //
app.use(stagesRoutes);

// * History * //
app.use(historyRoutes);

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})