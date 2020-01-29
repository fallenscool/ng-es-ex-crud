const {Router} = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Joi = require('joi');

const usersFilePath = path.join(__dirname, '../db.json');
const userSchema = require('../models/userSchema');

const router = Router();

//Get all users
const getUsers = async (req, res, next) => {
    try {
        const data = await fs.readFileSync(usersFilePath);
        const users = JSON.parse(data);
        res.status(200).json(users);
    } catch (e) {
        next(e);
    }
};

//Get one user
const getUser = async (req, res, next) => {
    try {
        const data = await fs.readFileSync(usersFilePath);
        const users = JSON.parse(data);
        const user = users.find(user => user.id === Number(req.params.id));
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        res.status(200).json(user)
    } catch (e) {
        next(e);
    }
};

// Create user
const createUser = async (req, res, next) => {
    try {
        const valid = Joi.validate(req.body, userSchema);
        if (valid.error) {
            const err = new Error(valid.error.details[0].message);
            err.status = 400;
            throw err;
        }
        const data = await fs.readFileSync(usersFilePath);
        let users = JSON.parse(data);
        let newUser = {
            id: _.last(users).id + 1,
            created: new Date()
        };
        _.forEach(req.body, (value, key) => newUser[key] = value);
        users.push(newUser);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        res.status(201).json({
            success: {
                message: `User ${newUser.name} ${newUser.surname} has been created!`
            }
        })
    } catch (e) {
        next(e)
    }
};

//Delete user by id
const deleteUser = async (req, res, next) => {
    try {
        const data = await fs.readFileSync(usersFilePath);
        let users = JSON.parse(data);
        const id = Number(req.params.id);
        const exist = !!_.find(users, ["id", id]);
        if (!exist) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        users = _.remove(users, user => user.id !== id);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        res.status(200).json({success: {message: 'User was deleted!'}})
    } catch (e) {
        next(e)
    }
};

// Edit user by id
const editUser = async (req, res, next) => {
    try {
        const valid = Joi.validate(req.body, userSchema);
        if (valid.error) {
            const err = new Error(valid.error.details[0].message);
            err.status = 400;
            throw err;
        }
        const data = await fs.readFileSync(usersFilePath);
        let users = JSON.parse(data);
        const id = Number(req.params.id);
        const exist = !!_.find(users, ["id", id]);
        if (!exist) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        let newUser = {
            id,
            created: new Date()
        };
        _.forEach(req.body, (value, key) => newUser[key] = value);
        users = _.map(users, user => user.id === id ? newUser : user);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        res.status(201).json({success: {message: `User ${newUser.name} ${newUser.surname} has been updated!`}})
    } catch (e) {
        next(e)
    }
};

router
    .route('/api/v1/users')
    .get(getUsers)
    .post(createUser);

router
    .route('/api/v1/users/:id')
    .get(getUser)
    .put(editUser)
    .delete(deleteUser);

module.exports = router;
