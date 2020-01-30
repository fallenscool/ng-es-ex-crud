const {Router} = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Joi = require('joi');

const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: 'http://localhost:9200'});

const usersFilePath = path.join(__dirname, '../db.json');
const userSchema = require('../models/userSchema');

const router = Router();

const checkQueries = (queries) => {
    if (!!queries.role) {
        return {query: {match: {role: queries.role}}}
    }
    return {aggs: {role: {terms: {field: "role"}}}};
};

//Get all users
const getUsers = async (req, res, next) => {
    try {
        const result = await client.search({
            index: 'users',
            body: checkQueries(req.query)
        });
        res.status(200).json({
            status: 200,
            message: 'Everything OK',
            result: result.body,
        });
    } catch (e) {
        next(e);
    }
};

//Get one user
const getUser = async (req, res, next) => {
    try {
        const result = await client.get({
            index: 'users',
            id: req.params.id
        });
        res.status(result.statusCode).json({
            status: result.statusCode,
            message: 'Everything OK',
            result: result.body._source,
        });

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
        let newUser = {
            created: new Date()
        };
        _.forEach(req.body, (value, key) => newUser[key] = value);
        const result = await client.index({
            index: 'users',
            body: newUser
        });
        res.status(result.statusCode).json({
            status: result.statusCode,
            message: `User ${newUser.name} ${newUser.surname} has been created!`
        });
    } catch (e) {
        next(e)
    }
};

//Delete user by id
const deleteUser = async (req, res, next) => {
    try {
        const result = await client.delete({
            index: 'users',
            id: req.params.id
        });
        res.status(result.statusCode).json({
            status: result.statusCode,
            message: `User has been deleted!`,
            result
        });
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
        let newUser = {
            created: new Date()
        };
        _.forEach(req.body, (value, key) => newUser[key] = value);

        const result = await client.index({
            index: 'users',
            id: req.params.id,
            body: newUser
        });
        res.status(result.statusCode).json({
            status: result.statusCode,
            message: `User ${newUser.name} ${newUser.surname} has been updated!`,
            result: result
        });
    } catch (e) {
        next(e)
    }
};

const deleteUsers = async (req, res, next) => {
    try {
        const ids = Object.values(req.body);
        const result = await client.deleteByQuery({
            index: 'users',
            body: {
                query: {
                    terms: {
                        _id: ids
                    }
                }
            }
        });
        res.status(result.statusCode).json({
            status: result.statusCode,
            message: `Users has been deleted`,
            result: result
        });
    } catch (e) {
        next(e)
    }
};

router
    .route('/api/v1/users')
    .get(getUsers)
    .post(createUser)
    .delete(deleteUsers);

router
    .route('/api/v1/users/:id')
    .get(getUser)
    .put(editUser)
    .delete(deleteUser);

module.exports = router;
