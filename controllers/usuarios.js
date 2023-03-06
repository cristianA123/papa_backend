const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT.JS');
const moment = require('moment');
const Usuario =  require('../models/usuario');


const usuariosGet = async (req = request, res= response) => {


    try {

         // const {q, nombre = "no ingreso nombre", apikey} = req.query;

        // const { limit =5, desde = 0 } = req.query;
        /*  const usuario = await Usuario.find( { estado : true } )
            .skip( Number( desde ) )  // podemos validar desde donde, por cualquier error
            .limit( Number(  limit));
        const total = await Usuario.countDocuments( { estado : true } ); */


        //Esto es una consulta mas rapida
        const [total, usuario] = await Promise.all([
            Usuario.countDocuments( { estado : true }),
            Usuario.find( { estado : true })
                // .skip( Number( 5 ) )  // podemos validar desde donde, por cualquier error
                // .limit( Number(  limit))
        ])

        return res.json({
            success: true,
            usuario,
            total
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Ocurió un problema inesperado, Comuniquese con el administrador"
        });
    }
   
};

const userFullName = async (req = request, res= response) => {

    try {

        // const usuario = await Usuario.find( { estado : true } )
        // .select('nombre apellido dni');

        const usuarios = await Usuario.aggregate([
            { $match: { estado: true } }, // filtra los documentos con estado verdadero
            {
              $project: {
                // _id: 0, // excluye el campo _id del resultado
                nombreCompleto: { $concat: [ "$nombre", " ", "$apellido" ] }, // combina los valores de nombre y correo en un solo campo
                dni: { $concat: [ "$dni"] }, // combina los valores de nombre y correo en un solo campo
              },
            },
          ]);

        return res.json({
            success: true,
            usuarios
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Ocurió un problema inesperado, Comuniquese con el administrador"
        });
    }
   
};

const usuariosPut = async (req = request, res =response ) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO VALIDAR EN LA BD
    if( password ){
        // Emcriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true })

    res.json({
        usuario
    });
}


const usuariosPost = async (req, res =response) => {

    try {
        const { nombre, correo, dni, } = req.body;
        const usuario = new Usuario( { nombre, correo, dni, role: '63fc095cf638591948efef84', ...req.body} );
    
        // Emcriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( dni, salt )
    
        //Guardar en BD
        await usuario.save();
    
        // Generar el JWT
        const token = await generarJWT( usuario.uid );
    
        return res.json({
            success: true,
            token,
            usuario
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Ocurió un problema inesperado, Comuniquese con el administrador"
        });
    }

 
}

const usuariosPath   =(req, res) => {
    res.json({
        'ok':true,
        msg: 'PATCH API'
    })
}



const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    const uid = req.uid;
    // Fisicamente lo borra,ps
    // const usuario = await Usuario.findByIdAndDelete( id );
    
    const usuario = await Usuario.findByIdAndUpdate( id, { estado :false } , { new : true } )
    const userAntesDeEliminar = req.usuario;


    res.json({
        'ok':true,
        msg: 'DELETE API',
        id,
        usuario,
        userAntesDeEliminar
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPath,
    usuariosDelete,
    userFullName
}

// PARA CREAR UN TAG
// git tag -a v0.0.2 -m "modulo 9 terminado"
// $ git push --tags

// PARA QUITAR EL SEGUIMIENTO DEL GIT
//git rm .env --cached
// *** agregar el archivo al gitignore , luego add, and commit


///VARIABLES PARA CONFIGURAR "HEROKU"
//  * heroku config  -> lista todas la variables de entorno
//  * heroku config:set nombreVariable = "variable"  -> Crear variable
//  * heroku config:get  -> listar las variables
//  * heroku config:unset  nombreVariale  -> eliminar varibale