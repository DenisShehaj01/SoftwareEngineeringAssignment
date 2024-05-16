const mysql = require('mysql');
const express = require('express');
const registercontroller = require('../../controllers/register');
const router = express.Router(); 

router.post('/reg',registercontroller.reg);

module.exports= router;