const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    if (!valido) { return client.disconnect(); }
    console.log('Cliente autenticado');

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar el usuario a una sala especifica
    client.join(uid);

    // Escuchar em mensaje-personal del cliente
    client.on('mensaje-personal', async (payload) => {
        await grabarMensaje(payload);
        io.to(payload.from).emit('mensaje-personal', payload);
    });


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });
});