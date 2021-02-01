const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaUsers = require('./routes/users');
const rotaChurchs = require('./routes/churchs');
const rotaUserFunction = require('./routes/userfunction');
const rotaSchedules = require('./routes/schedules');
const rotaWarning = require('./routes/warning');

const rotaLogin = require('./routes/login');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'),
    res.header('Access-Control-Allow-Header', 
        'Content-Type, Origin, X-Requested-With, Accept, Authorization'
    );

    if(res.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/users', rotaUsers);
app.use('/churchs', rotaChurchs);
app.use('/userfunction', rotaUserFunction);
app.use('/schedules', rotaSchedules);
app.use('/warning', rotaWarning);

app.use('/login', rotaLogin);

app.use((req, res, next) =>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;