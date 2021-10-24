const Mensaje = require('../models/mensaje');

const obtenerChat = async (req, res) => {
    const myId = req.uid;
    const messageTo = req.params.to;

    const last30 = await Mensaje.find({
        $or: [
            {to: myId, from: messageTo},
            {to: messageTo, from: myId}
        ]
    })
    .sort({createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        mensajes: last30
        
    });
}

module.exports = {
    obtenerChat
}