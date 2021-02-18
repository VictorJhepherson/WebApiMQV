const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const bcrypt = require('bcrypt');

exports.getUserProfile = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL SELECT_USERPROFILE(?);',
            [req.body.USR_ID],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                return res.status(200).send({ mensagem: 'Consulta realizada com sucesso', data: result[0] });
            }
        )
    });
}

exports.getUsers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL SELECT_USERS();', 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                
                return res.status(200).send({ data: result[0] });
            }
        )
    });
};

exports.getUsersByName = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL SELECT_USERSBYNAME(?);',
            [req.body.USR_NAME], 
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }
                return res.status(200).send({ data: result[0] });
            }
        )
    });
};

exports.insertUsers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query('SELECT SU_LOGINNAME FROM SYSTEMUSERS WHERE SU_LOGINNAME = ?', [req.body.SU_LOGINNAME], (error, results) => {
            if(error) { return res.status(500).send({ error: error }) }
            if(results.length > 0){
                res.status(409).send({ mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.SU_PASSWORD, 10, (errBcrypt, hash) => {
                    if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        'CALL INSERT_USERS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                        [
                            req.body.USRTYPE, req.body.USR_NAME, 'https://projectmqv-webapi.herokuapp.com/' + req.file.path, 
                            req.body.USR_DATEBIRTHDAY, req.body.USR_FUNCTIONID, req.body.USR_PHONENUMBER, req.body.CHURCH_ID, 
                            req.body.USR_REGUSER, req.body.USRDOC_CPFNUMBER, req.body.USRDOC_RGNUMBER,
                            req.body.STREET, req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, req.body.COMPLEMENT,
                            req.body.TYPEHOUSE, req.body.CITY, req.body.STATE, req.body.SU_LOGINNAME, hash
                        ],
                        (error, result, field) => {
                            conn.release();
                            if(error) { res.status(500).send({ error: error }) }
            
                            return res.status(201).send({
                                mensagem: 'Usuário criado com sucesso',
                                USR_ID: result.insertId
                            });
                        }
                    )
                });
            }
        })
    });
};

exports.registerUsers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query('SELECT SU_LOGINNAME FROM SYSTEMUSERS WHERE SU_LOGINNAME = ?', [req.body.SU_LOGINNAME], (error, results) => {
            if(error) { return res.status(500).send({ error: error }) }
            if(results.length > 0){
                res.status(409).send({ mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.SU_PASSWORD, 10, (errBcrypt, hash) => {
                    if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        'CALL REGISTER_USERS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                        [
                            req.body.USR_NAME, 'https://projectmqv-webapi.herokuapp.com/' + req.file.path, req.body.USR_DATEBIRTHDAY, req.body.USR_FUNCTIONID, 
                            req.body.USR_PHONENUMBER, req.body.CHURCH_ID, req.body.USRDOC_CPFNUMBER, 
                            req.body.USRDOC_RGNUMBER, req.body.STREET, req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, req.body.COMPLEMENT,
                            req.body.TYPEHOUSE, req.body.CITY, req.body.STATE, req.body.SU_LOGINNAME, hash
                        ],
                        (error, result, field) => {
                            conn.release();
                            if(error) { res.status(500).send({ error: error }) }
            
                            return res.status(201).send({
                                mensagem: 'Usuário criado com sucesso',
                                USR_ID: result.insertId
                            });
                        }
                    )
                });
            }
        })
    });
};

exports.updateUsers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL UPDATE_USERS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                req.body.USR_ID, req.body.USRTYPE, req.body.USR_NAME, 
                req.body.USR_DATEBIRTHDAY, req.body.USR_PHONENUMBER, req.body.CHURCH_ID, 
                req.body.USR_STATUS, req.body.USRDOC_CPFNUMBER, 
                req.body.USRDOC_RGNUMBER, req.body.STREET, 
                req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, req.body.COMPLEMENT, req.body.TYPEHOUSE, 
                req.body.CITY, req.body.STATE, req.body.SU_LOGINNAME, req.body.P_USRID_REGUSER
            ],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Usuário atualizado com sucesso'
                });
            }
        )
    });
};

exports.deleteUsers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'CALL DELETE_USERS(?);',
            [req.body.USR_ID],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error, response: null }) }

                res.status(202).send({
                    mensagem: 'Usuário removido com sucesso'
                });
            }
        )
    });
};

exports.updatePass = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        bcrypt.hash(req.body.SU_PASSWORD, 10, (errBcrypt, hash) => {
            if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
                conn.query(
                    `UPDATE SYSTEMUSERS
                        SET SU_PASSWORD = ?
                      WHERE USR_ID = ?`,
                    [hash, req.body.USR_ID],
                    (error, result, field) => {
                        conn.release();
                        if(error) { res.status(500).send({ error: error, response: null }) }

                        res.status(202).send({
                            mensagem: 'Senha atualizada com sucesso'
                        });
                    }
                )
        });
    });
};

exports.updatePhoto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `UPDATE USERS
                SET USR_PHOTO = ?
                WHERE USR_ID = ?`,
            ['https://projectmqv-webapi.herokuapp.com/' + req.file.path, req.body.USR_ID],
            (error, result, field) => {
                conn.release();
                if(error) { res.status(500).send({ error: error, response: null }) }

                res.status(202).send({
                    mensagem: 'Foto atualizada com sucesso'
                });
            }
        )
    });
};