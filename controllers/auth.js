const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crerUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        const existEmail = await Usuario.findOne({ email });
        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseñas
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWt
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'No pudo recuperar el email.'
        });
    }

}

const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado.'
            });
        }

        const validatePassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validatePassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuarioDB.id);

        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador.'
        });
    }
}


const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);
    res.json({
        ok: true,
        usuario,
        token
    });
};

module.exports = {
    crerUsuario,
    login,
    renewToken
}