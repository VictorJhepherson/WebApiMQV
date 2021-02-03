const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getChurchs = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
        `SELECT CHURCH_ID, 
                CHURCH_DESC
           FROM CHURCHS
          WHERE CHURCH_STATUS = 'A'`,
            (error, results, fields) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error }) }
                if (results.length < 1) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação'});
                } else {
                    return res.status(200).send({ mensagem: 'Autenticado com sucesso', data: results});
                }
            }
        );
    });
};

exports.getTypeHouse = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
        `SELECT TYPEHOUSE_ID, 
                TYPEHOUSE_DESC
           FROM TYPEHOUSE
          WHERE TYPEHOUSE_STATUS = 'A'`,
            (error, results, fields) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error }) }
                if (results.length < 1) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação'});
                } else {
                    return res.status(200).send({ mensagem: 'Autenticado com sucesso', data: results});
                }
            }
        );
    });
};