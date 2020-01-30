const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3200;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(express.json());
app.use('/', require(path.join(__dirname, 'routes/usersRoutes.js')));

app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} Not Found`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.json({
        status: err.status || 500,
        message: err.message
    });

});

app.listen(PORT, () => {
    console.log(`Server has been started on port: ${app.get('port')} | environment: ${app.get('env')}`)
});
