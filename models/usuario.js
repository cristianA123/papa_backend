
const {  Schema, model } = require('mongoose');
const moment = require('moment');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        // required: [true, "El nombre es obligatorio"],
    },
    apellido: {
        type: String,
        // required: [true, "El nombre es obligatorio"],
    },
    correo: {
        type: String,
        // required: [false, "El email es obligatorio"],
        // unique: true

    },
    dni: {
        type: String,
        // unique: false
    },
    password: {
        type: String,
        // required: [false, "El nombre es obligatorio"],

    },
    img: {
        type : String
    },
    role : {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        // required :  true
    },
    // rol: {
    //     type: String,
    //     required: true,
    //     default:"USER_ROLE",
    //     emun: ['ADMIN_ROLE','USER_ROLE'] 
    // },
    status: {
        type: Boolean,
        default: true,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: moment(),
    },
    updatedAt: {
        type: Date,
        default: moment(),
    }

});

UsuarioSchema.methods.toJSON = function(){
    const {_id, __v, password, ...usuarioRestoInformacion } = this.toObject();
    usuarioRestoInformacion.uid = _id;
    return usuarioRestoInformacion;
}




module.exports = model( 'Usuario',UsuarioSchema );






