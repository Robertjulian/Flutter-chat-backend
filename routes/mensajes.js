/*
    path: 'api/mensajes'
*/
const { Router } = require('express');
const { obtenerChat } = require('../controllers/mensajes');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:to', validarJWT, obtenerChat);

module.exports = router;