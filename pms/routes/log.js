const mysql = require('mysql');
const express = require('express');
const logcontroller = require('../../controllers/log');

const router = express.Router(); 

router.post('/login',logcontroller.login);

module.exports= router;