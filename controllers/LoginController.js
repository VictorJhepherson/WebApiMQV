const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM SYSTEMUSERS SU INNER JOIN USERS USR ON USR.USR_ID = SU.USR_ID WHERE SU_LOGINNAME = ?';
        const result = await mysql.execute(query, [req.body.SU_LOGINNAME]);
        if(result.length < 1)
            return res.status(401).send({ mensagem: 'Falha na autenticação'});
        bcrypt.compare(req.body.SU_PASSWORD, results[0].SU_PASSWORD, (err, results) => {
            if(results) {
                let token = jwt.sign({
                    SU_LOGINNAME: results[0].SU_LOGINNAME
                }, process.env.JWT_KEY, {expiresIn: "7d" });

                const response = {
                    mensagem: 'Autenticado com sucesso',
                    user: result[0],
                    token: token
                };
                return res.status(200).send(response);
            } else if(err) {
                return res.status(401).send({ mensagem: 'Falha na autenticação'});
            }
        });
    } catch(error) {
        return res.status(500).send({error: error});
    }
};

exports.logout = (req, res, next) => {
    if (req.body.token != null && req.body.token != undefined) {
        return res.status(200).send({ mensagem: 'Logout com sucesso', token: null });
    } 
};

exports.refresh = async (req, res, next) => {
    try {
        if (req.body.token != null && req.body.token != undefined) {
            const query = 'SELECT * FROM SYSTEMUSERS SU INNER JOIN USERS USR ON USR.USR_ID = SU.USR_ID WHERE SU.USR_ID = ?';
            const result = await mysql.execute(query, [req.body.user]);
            if (result.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação'});
            } else {
                let token = jwt.sign({ 
                    SU_LOGINNAME: results[0].SU_LOGINNAME 
                }, process.env.JWT_KEY, {expiresIn: "7d" });
    
                const response = {
                    mensagem: 'Autenticado com sucesso',
                    user: result[0],
                    token: token
                };
                return res.status(200).send(response);
            }
        } else {
            return res.status(401).send({ mensagem: 'Falha na autenticação'});
        }
    } catch(error) {
        return res.status(500).send({error: error});
    }
};