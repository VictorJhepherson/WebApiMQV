const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * 
                        FROM SYSTEMUSERS SU
                       INNER JOIN USERS USR
                          ON USR.USR_ID = SU.USR_ID
                       WHERE SU_LOGINNAME = ?`;
        conn.query(query, [req.body.SU_LOGINNAME], (error, results, fields) => {
            conn.release();
            if(error) { return res.status(500).send({ error: error }) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação'});
            }
            bcrypt.compare(req.body.SU_PASSWORD, results[0].SU_PASSWORD, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação'});
                }
                if (result) {
                    let token = jwt.sign({
                        SU_ID: results[0].SU_ID,
                        USR_ID: results[0].USR_ID,
                        SU_LOGINNAME: results[0].SU_LOGINNAME
                    }, process.env.JWT_KEY, {expiresIn: "7d" });
                    return res.status(200).send({ mensagem: 'Autenticado com sucesso', data: results, token: token });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação'});
            });
        });
    });
};

exports.refresh = (req, res, next) => {
    console.log(req.body.token);
    if (req.body.token != null && req.body.token != undefined) {
        let token = jwt.sign(req.body.USR_ID, process.env.JWT_KEY, {expiresIn: "7d"});
        return res.status(200).send({ mensagem: 'Autenticado com sucesso', token: token});
    } else {
        return res.status(401).send({ mensagem: 'Falha na autenticação'});
    }
};