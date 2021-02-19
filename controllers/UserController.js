const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const bcrypt = require('bcrypt');

exports.getUserProfile = async (req, res, next) => {
    try {
        const query = "CALL SELECT_USERPROFILE(?)";
        const result = await mysql.execute(query, [req.body.USR_ID]);
        const response = {
            data: result
        };
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const query = "CALL SELECT_USERS()";
        const result = await mysql.execute(query);
        const response = {
            data: result[0]
        };
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};

exports.getUsersByName = async (req, res, next) => {
    try {
        const query = "CALL SELECT_USERSBYNAME(?)";
        const result = await mysql.execute(query, [req.body.USR_NAME]);
        const response = {
            data: result[0]
        };
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};

exports.insertUsers = async (req, res, next) => {
    try {
        const login = await mysql.execute("SELECT SU_LOGINNAME FROM SYSTEMUSERS WHERE SU_LOGINNAME = ?", [req.body.SU_LOGINNAME]);
        if(login.length > 0){
            res.status(409).send({ mensagem: 'Usuário já cadastrado'})
        } else {
            bcrypt.hash(req.body.SU_PASSWORD, 10, (errBcrypt, hash) => {
                if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
                const query = "CALL INSERT_USERS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                await mysql.execute(query,  
                [
                    req.body.USRTYPE, req.body.USR_NAME, 'https://projectmqv-webapi.herokuapp.com/' + req.file.path, 
                    req.body.USR_DATEBIRTHDAY, req.body.USR_PHONENUMBER, req.body.CHURCH_ID, 
                    req.body.USR_REGUSER, req.body.USRDOC_CPFNUMBER, req.body.USRDOC_RGNUMBER,
                    req.body.STREET, req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, req.body.COMPLEMENT,
                    req.body.TYPEHOUSE, req.body.CITY, req.body.STATE, req.body.SU_LOGINNAME, hash
                ]);
                const response = {
                    mensagem: 'Usuário criado com sucesso'
                };
                return res.status(200).send(response);
            });
        }
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};

exports.registerUsers = async (req, res, next) => {
    try {
        const login = await mysql.execute("SELECT SU_LOGINNAME FROM SYSTEMUSERS WHERE SU_LOGINNAME = ?", [req.body.SU_LOGINNAME]);
        if(login.length > 0){
            res.status(409).send({ mensagem: 'Usuário já cadastrado'});
        } else {
            bcrypt.hash(req.body.SU_PASSWORD, 10, (errBcrypt, hash) => {
                if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
                const query = "CALL REGISTER_USERS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                await mysql.execute(query,  
                [
                    req.body.USR_NAME, 'https://projectmqv-webapi.herokuapp.com/' + req.file.path, req.body.USR_DATEBIRTHDAY,
                    req.body.USR_PHONENUMBER, req.body.CHURCH_ID, req.body.USRDOC_CPFNUMBER, 
                    req.body.USRDOC_RGNUMBER, req.body.STREET, req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, req.body.COMPLEMENT,
                    req.body.TYPEHOUSE, req.body.CITY, req.body.STATE, req.body.SU_LOGINNAME, hash
                ]);
                const response = {
                    mensagem: 'Usuário criado com sucesso'
                };
                return res.status(200).send(response);
            });
        }
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};

exports.updateUsers = async (req, res, next) => {
    try {
        const query = "CALL UPDATE_USERS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await mysql.execute(query, 
        [
            req.body.USR_ID, req.body.USRTYPE, req.body.USR_NAME, 
            req.body.USR_DATEBIRTHDAY, req.body.USR_PHONENUMBER, req.body.CHURCH_ID, 
            req.body.USR_STATUS, req.body.USRDOC_CPFNUMBER, 
            req.body.USRDOC_RGNUMBER, req.body.STREET, 
            req.body.NEIGHBORHOOD, req.body.NUMBER_HOUSE, req.body.COMPLEMENT, req.body.TYPEHOUSE, 
            req.body.CITY, req.body.STATE, req.body.SU_LOGINNAME, req.body.P_USRID_REGUSER
        ]);
        const response = {
            mensagem: 'Usuário atualizado com sucesso'
        };
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};

exports.deleteUsers = async (req, res, next) => {
    try {
        const query = "CALL DELETE_USERS(?)";
        await mysql.execute(query, [req.body.USR_ID]);
        const response = {
            mensagem: 'Usuário removido com sucesso'
        };
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};

exports.updatePass = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.SU_PASSWORD, 10, (errBcrypt, hash) => {
            if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
            const query = "UPDATE SYSTEMUSERS SET SU_PASSWORD = ? WHERE USR_ID = ?";
            await mysql.execute(query, [hash, req.body.USR_ID]);
            const response = {
                mensagem: 'Senha atualizada com sucesso'
            };
            return res.status(200).send(response);
        });
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};

exports.updatePhoto = async (req, res, next) => {
    try {
        const query = "UPDATE USERS SET USR_PHOTO = ? WHERE USR_ID = ?";
        await mysql.execute(query, [req.file.path, req.body.USR_ID]);
        const response = {
            mensagem: 'Foto atualizada com sucesso'
        };
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error }) 
    }
};
