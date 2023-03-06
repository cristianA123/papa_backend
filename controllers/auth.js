const { response, request } = require( 'express' );
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT.JS');
const { googleVerify } = require('../helpers/google-verify');

const login = async ( req=request, res= response) =>{

    const { correo , password } = req.body;

    try {
        
        // Verificar si el correo existe
        const usuario = await Usuario.findOne( {correo} )

        if(  !usuario ){
            return   res.status(400).json({
                        success: false,
                        msg:'Usuario / Password incorrectos',
                        correo
                    })  
        }

        // Si el usuario esta Activo
        if(  !usuario.estado ){
            return   res.status(400).json({
                        success: false,
                        msg:'Usuario / Password incorrectos',
                        correo
                    })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password )
        if( !validPassword ){
            return   res.status(400).json({
                        success: false,
                        msg:'Usuario / Password incorrectos',
                        correo
            })
        }

        const token = await generarJWT( usuario.id );

        return res.json({
            success: true,
            token,
            usuario
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg:'Ocurió un problema inesperado, Hable con el Admi'
        })
    }
}

const googleSignin = async ( req = request , res= response )=>{


    const { id_token } = req.body;

    try {

        const  {correo, nombre,img} = await googleVerify( id_token );

        console.log("8888888888888888888888888888888888888888888888888888888888888888")
        // console.log(googleUser);

        // Generar la referencia para saber si ya existe en la base de datos
        let usuario = await Usuario.findOne( { correo } );
        if( !usuario ){
            // Tengo que crearlo

            const data = {
                nombre,
                correo,
                password: "123456arbol",
                img,
                google:true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // si el usuario en DB
        if( !usuario.estado ){
            return res.status(401).json({
                success: false,
                msg: "Hable con el administrador, usuario bloqueado"
            });
        }
        let user_id = usuario.id;
        //Generar el JWT
        const token = await generarJWT( usuario.uid );

        return res.json({
            success: true,
            msg : 'Se inicio session con google',
            id_token,
            token,
            usuario,
            user_id
        })


    } catch (error) {

        console.log(error);

        return res.status(400).json({
            success: false,
            msg : 'Token de Google no es valido',
            id_token
        });
        
    }


}

const RenovarJWT = async (req = request , res= response )=>{

    const usuario = req.usuario;


    try {

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            success: true,
            token,
            usuario
            
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg:'Ocurió un problema inesperado, Hable con el Admi'
        })
    }



}

const me = async ( req=request, res= response) =>{

    console.log(req.usuario);
    const { correo  } = req.usuario;

    try {
        
        const usuario = await Usuario.findOne( {correo} )

        if(  !usuario ){
            return   res.status(400).json({
                        success: false,
                        msg:'Usuario / Password incorrectos',
                    })  
        }

        return res.json({
            success: true,
            usuario
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg:'Ocurrio un problema inesperado, Hable con el Admi'
        })
    }
}


module.exports = {
      login,
      googleSignin,
      RenovarJWT,
      me
}