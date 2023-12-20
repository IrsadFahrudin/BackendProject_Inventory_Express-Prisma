const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authController = require('./routes/authController')
const crudInventory = require('./routes/crudInventory')
const crudPeminjaman = require('./routes/crudPeminjaman')
// const getHistory = require('./routes/getHistory')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authController);
app.use('/inventory', crudInventory, crudPeminjaman);
// app.use('/history', getHistory);


module.exports = app;
