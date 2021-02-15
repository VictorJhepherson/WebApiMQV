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
          WHERE CHURCH_STATUS = 'A'
            AND CHURCH_DESC NOT IN (?)`,
            [req.body.CHURCH_DESC],
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
          WHERE TYPEHOUSE_STATUS = 'A'
            AND TYPEHOUSE_DESC NOT IN (?)`,
            [req.body.TYPEHOUSE_DESC],
            (error, results, fields) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error }) }
                
                return res.status(200).send({ mensagem: 'Autenticado com sucesso', data: results});
            }
        );
    });
};

exports.getStates = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
        `SELECT *
           FROM STATES
          WHERE STATES_DESC NOT IN (?)`,
            [req.body.STATES_DESC],
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