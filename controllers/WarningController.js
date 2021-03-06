const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');

exports.getWarnings = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL SELECT_WARNINGS();', 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                
                res.status(200).send({
                    warnings: result[0]
                });
            }
        )
    });
};

exports.getWarning = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `SELECT *
               FROM WARNINGS WRG
              INNER JOIN WARNINGPHOTOS WPH
                 ON WRG.WARNING_ID = WPH.WARNING_ID
              INNER JOIN ADDRESSWARNING ADW
                 ON WRG.WARNING_ID = ADW.WARNING_ID
              WHERE WRG.WARNING_ID = ?`,
            [req.body.WARNING_ID], 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                
                res.status(202).send({
                    warnings: result
                });
            }
        )
    });
};

exports.insertWarnings = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL INSERT_WARNINGS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                req.body.WARNING_TITLE, req.body.WARNING_DATE, req.body.WARNING_REGUSER, req.file.path, req.body.STREET,
                req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, req.body.COMPLEMENT, req.body.CITY, req.body.STATE            
            ],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Aviso inserido com sucesso'
                });
            }
        )
    });
};

exports.insertWarningPhoto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL INSERT_WARNINGPHOTOS(?, ?)',
            [req.body.WARNING_ID, req.file.path],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Foto do Aviso' + req.body.WARNING_ID + 'atualizado com sucesso'
                });
            }
        )
    });
};

exports.updateWarnings = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL UPDATE_WARNINGS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                req.body.WARNING_ID, req.body.WARNING_TITLE, req.body.WARNING_DATE, req.body.WARNING_STATUS, 
                req.body.WARNING_REGUSER, req.body.STREET, req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, 
                req.body.COMPLEMENT, req.body.CITY, req.body.STATE
            ],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Aviso atualizado com sucesso'
                });
            }
        )
    });
};


exports.deleteWarnings = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL DELETE_WARNINGS(?);',
            [req.body.WARNING_ID],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error, response: null }) }

                res.status(202).send({
                    mensagem: 'Aviso removido com sucesso'
                });
            }
        )
    });
};