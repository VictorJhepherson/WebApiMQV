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
                        SU_LOGINNAME: results[0].SU_LOGINNAME
                    }, process.env.JWT_KEY, {expiresIn: "7d" });
                    return res.status(200).send({ mensagem: 'Autenticado com sucesso', data: results[0], token: token });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação'});
            });
        });
    });
};

exports.logout = (req, res, next) => {
    if (req.body.token != null && req.body.token != undefined) {
        res.status(200).send({ mensagem: 'Logout com sucesso', token: null });
    } 
};

exports.refresh = (req, res, next) => {
    const data = req.body.user;
    if (req.body.token != null && req.body.token != undefined) {
        let token = jwt.sign({SU_LOGINNAME: data.SU_LOGINNAME}, process.env.JWT_KEY, {expiresIn: "7d"});
        return res.status(200).send({ mensagem: 'Autenticado com sucesso', token: token});
    } else {
        return res.status(401).send({ mensagem: 'Falha na autenticação'});
    }
};