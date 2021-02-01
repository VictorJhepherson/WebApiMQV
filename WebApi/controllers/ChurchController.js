const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

exports.getChurchs = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
        'CALL SELECT_CHURCH();', 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                
                res.status(200).send({
                    church: result
                });
            }
        )
    });
};

exports.getChurchsByDesc = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL SELECT_CHURCHBYDESC(?);',
            [req.body.CHURCH_DESC], 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(200).send({
                    church: result
                });
            }
        )
    });
};

exports.insertChurchs = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL INSERT_CHURCHS(?);',
            [req.body.CHURCH_DESC],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Igreja criada com sucesso',
                    CHURCH_ID: result.insertId
                });
            }
        )
    });
};

exports.updateChurchs = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL UPDATE_CHURCHS(?, ?, ?)',
            [req.body.CHURCH_ID, req.body.CHURCH_DESC, req.body.CHURCH_STATUS],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Igreja atualizada com sucesso'
                });
            }
        )
    });
};

exports.deleteChurchs = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL DELETE_CHURCHS(?);',
            [req.body.CHURCH_ID],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error, response: null }) }

                res.status(202).send({
                    mensagem: 'Igreja removida com sucesso'
                });
            }
        )
    });
};