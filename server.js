const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const Joi = require('joi');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3200;

// Get users from db.json
const data = fs.readFileSync('db.json');
let users = JSON.parse(data);

//create user schema for validation
const userSchema = {
    name: Joi.string().min(3).max(60).required(),
    surname: Joi.string().min(3).max(60).required(),
    birthday: Joi.string().required(),
    phone: Joi.string().regex(/^0\d{9}$/, {name: 'phone number (0xxyyyyyyy)'}).required(),
    email: Joi.string().email().required(),
};


// Read user/users
app.get('/api/users/:id?', (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.send(users);
    let user = _.find(users, ['id', id]);
    return res.send(user ? user : {message: `User with id ${id} not found!`});
});

// Create user
app.post('/api/users', (req, res) => {
    const valid = Joi.validate(req.body, userSchema);
    if (valid.error) {
        return res.status(400).send(valid.error.details[0].message);
    }
    let newUser = {
        id: _.last(users).id + 1,
        "create/update": new Date()
    };
    _.forEach(req.body, (value, key) => newUser[key] = value);
    users.push(newUser);
    saveToBase(users);
    res.send(newUser);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const exist = !!_.find(users, ["id", id]);
    if (exist) {
        users = _.remove(users, user => user.id !== id);
        saveToBase(users);
        return res.status(200).send({message: `User with id ${id} was deleted!`});
    }
    return res.status(404).send({message: `User with id ${id} doesn't exist`});
});

//Update user
app.put('/api/users/:id', (req, res) => {
    const valid = Joi.validate(req.body, userSchema);
    const id = Number(req.params.id);
    if (valid.error) {
        return res.status(400).send(valid.error.details[0].message);
    }
    let newUser = {
        id: id,
        "create/update": new Date()
    };
    _.forEach(req.body, (value, key) => newUser[key] = value);
    users = _.map(users, user => user.id === id ? newUser : user);
    saveToBase(users);
    res.send(newUser);
});

//Save new users array to db.json
const saveToBase = (arr) => {
    let data = JSON.stringify(arr, null, 2);
    return fs.writeFile('db.json', data, (err, result) => {
        if (err) console.log('error', err);
    });
};

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
