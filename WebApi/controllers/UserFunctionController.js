const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

exports.getFunction = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.SELECT_USERFUNCTION();', 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                
                res.status(200).send({
                    userfunction: result
                });
            }
        )
    });
};

exports.getFunctionByDesc = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.SELECT_USERFUNCTIONBYDESC(?);',
            [req.body.USERFUNC_DESC], 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(200).send({
                    userfunction: result
                });
            }
        )
    });
};

exports.insertUserFunction = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.INSERT_USERFUNCTION(?);',
            [req.body.USERFUNC_DESC],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Função criada com sucesso',
                    USERFUNC_ID: result.insertId
                });
            }
        )
    });
};

exports.updateUserFuntion = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.UPDATE_USERFUNCTION(?, ?, ?)',
            [req.body.USERFUNC_ID, req.body.USERFUNC_DESC, req.body.USRFUNC_STATUS],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Função atualizada com sucesso'
                });
            }
        )
    });
};

exports.deleteUserFunction = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.DELETE_USERFUNCTION(?);',
            [req.body.USERFUNC_ID],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error, response: null }) }

                res.status(202).send({
                    mensagem: 'Função removida com sucesso'
                });
            }
        )
    });
};