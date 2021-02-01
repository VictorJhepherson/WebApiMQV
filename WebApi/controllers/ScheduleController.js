const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

exports.getSchedules = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.SELECT_SCHEDULES();', 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                
                res.status(200).send({
                    schedules: result
                });
            }
        )
    });
};

exports.getSchedulesByTitle = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.SELECT_SCHEDULESBYTITLE(?);',
            [req.body.SCHEDULE_TITLE], 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(200).send({
                    schedules: result
                });
            }
        )
    });
};

exports.insertSchedules = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.INSERT_SCHEDULES(?, ?, ?, ?, ?);',
            [
                req.body.USERFUNC_DESC, req.body.SCHEDULE_TITLE, req.body.SCHEDULE_DATE, 
                req.body.SCHEDULE_INFORMATION, req.body.P_CHURCH_ID
            ],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Agenda criada com sucesso',
                    SCHEDULE_ID: result.insertId
                });
            }
        )
    });
};

exports.updateSchedules = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.UPDATE_SCHEDULES(?, ?, ?, ?, ?, ?)',
            [
                req.body.SCHEDULE_ID, req.body.SCHEDULE_DESC, req.body.P_SCHEDULE_TITLE,
                req.body.SCHEDULE_DATE, req.body.SCHEDULE_INFORMATION, req.body.CHURCH_ID
            ],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Agenda atualizada com sucesso'
                });
            }
        )
    });
};

exports.deleteSchedules = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL HOMOLOG_MQV.DELETE_SCHEDULES(?);',
            [req.body.SCHEDULE_ID],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error, response: null }) }

                res.status(202).send({
                    mensagem: 'Agenda removida com sucesso'
                });
            }
        )
    });
}