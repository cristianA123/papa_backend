const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { Categoria, Producto, Deposito } =  require('../models');

const getDepositos = async (req = request, res= response) => {

    const [total, productos] = await Promise.all([
        Producto.countDocuments( { estado : true }),
        
        Producto.find( { estado : true }).populate( "usuario",["_id" ] )
            .populate('categoria',["_id", "usuario"])
    ]);

    res.json({
        productos,
        total
    });
};

const getDeposito = async (req = request, res= response) => {

    const _id = req.params.id;


    const producto = await Producto.findOne(  { _id, estado : true } ); 

    if( !producto ){
        return  res.status(400).json({
            msg : "El id no es valido - sigue intentando estado false"
        })
    }
    

    res.json({
        producto,
    });
};

const crearDeposito = async (req, res =response) => {

    try {

       
        const { user_id, monto } = req.body;

        const deposito = await Deposito({ usuario : user_id, monto})
        deposito.save();

        if (!deposito) {
            return res.status( 400 ).json({
                success: false,
                msg: 'No se pudo creqar deposito, revise los datops enviados'
            });
        }
    
        
        return res.status( 201 ).json({
            success: true,
            data: deposito
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Ocurió un problema inesperado, Comuniquese con el administrador"
        });
    }

  
    

}

const actualizarDeposito = async (req = request, res =response ) => {

    const id = req.params.id;
    const {precio, 
        descripcion, 
        disponible ,
        categoria, 
        img,
        idProducto,
        mac,
        activo
    } = req.body;

    const nombre = req.body.nombre.toUpperCase();

    const nombrebica = await Producto.findOne( { 
        nombre, 
        estado:true
    } )

    const validarestadocategoria = await Categoria.findById(categoria);
    if(!validarestadocategoria.estado){
        return res.status( 400 ).json({
            msg:"Verifique el estado de la categoria"
        })
    }

    const productoID = await Producto.findById(id)

    if(productoID.nombre!==nombre){
        const productoDB = await Producto.findOne({ nombre });

        if (productoDB) {
          return res.status(400).json({
            msg:`  La Producto ${productoDB.nombre}, ya existe, Romel mmgvzo!!`,
          });
        }
      }

    const productomodificado = await Producto.findByIdAndUpdate(
        id, 
        {
            nombre,
            precio,
            descripcion,
            disponible,
            img,
            idProducto,
            mac,
            activo
        },
        { new: true })

    console.log(productomodificado);

    res.json({
        productomodificado
    });
}

const borrarDeposito = async (req, res) => {

    const { id } = req.params;
    
    const producto = await Producto.findByIdAndUpdate( id, { estado :false } , { new : true } )

    res.json({
        'ok':true,
        msg: 'DELETE API',
        id,
        producto,
    })
}

module.exports = {
    getDepositos,
    getDeposito,
    crearDeposito,
    actualizarDeposito,
    borrarDeposito
}