
const { Schema, model } = require( 'mongoose' );
const moment = require('moment');


const DepositoSchema = Schema({

    fecha:{
        type: Date,
    },
    monto:{
        type: Number,
        default: 0,
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required :  true
    },
    state:{
        type: Boolean,
        default: true,
    },
    status:{
        type: Boolean,
        default: true,
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

DepositoSchema.methods.toJSON = function(){
    const {__v,estado,...data } = this.toObject();
   
    return data;
}


module.exports = model( 'Deposito', DepositoSchema );

