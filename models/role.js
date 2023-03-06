

const { Schema, model } = require( 'mongoose' );


const RoleSchema = Schema({
    id:{
        type: Number,
        require: [true, "El id es obligatorio"]
    },
    rol:{
        type: String,
        require: [true, "El rol es obligatorio"]
    },
    name:{
        type: String,
        require: [true, "El name es obligatorio"]
    },
    estado: {
        type: Boolean,
        default: true,
        required : true
    }

});


module.exports = model( 'Role', RoleSchema );