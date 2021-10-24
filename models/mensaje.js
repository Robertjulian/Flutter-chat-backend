const { Schema, model } = require('mongoose');

const MensajeSchema = Schema ({
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true 
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true 
    },
    messaje: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

MensajeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('Mensaje', MensajeSchema);