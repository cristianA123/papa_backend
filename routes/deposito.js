const { Router } = require( 'express' );
const { check } = require('express-validator');
const { 
        getDepositos, 
        getDeposito, 
        crearDeposito, 
        actualizarDeposito, 
        borrarDeposito 
    } = require('../controllers/deposito');

const { 
        existeCategoria,
        estadoActivoProducto,
        existeProducto,
        existecategoriaConEstadoTrue,
        existeProductoporId } = require('../helpers/db-validators');

const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.get('/', getDepositos)

router.get('/:id',
[
    check('id',"El id del producto no es ID valido").isMongoId() ,
    check('id').custom( existeProductoporId ),
    validarCampos
]
, getDeposito )

router.post('/', 
[
    validarJWT,
    // check('categoria',"El valor de categoria no es ID valido de mongo").isMongoId(),
    // check('categoria').custom( existeCategoria ),
    check( "user_id","El user_id es obligatorio" ).not().isEmpty(),
    check( "monto","El monto es obligatorio" ).not().isEmpty(),
    // check( "descripcion","El descripcion es obligatorio" ).not().isEmpty(),
    // check( "idProducto","El idProducto es obligatorio" ).not().isEmpty(),
    // check( "mac","La mac es obligatorio" ).not().isEmpty(),
    // check( "activo","El activo del producto es obligatorio" ).not().isEmpty(),
    validarCampos
]
, crearDeposito);


router.put('/:id',[
    validarJWT,
    check('id',"El id del producto no es ID valido").isMongoId() ,
    check('id').custom( existeProducto ),
    check( "nombre","El nombre es obligatorio" ).not().isEmpty(),
    check( "precio","El precio es obligatorio" ).not().isEmpty(),
    check( "descripcion","El descripcion es obligatorio" ).not().isEmpty(),
    check( "idProducto","El idProducto es obligatorio" ).not().isEmpty(),
    check( "mac","La mac es obligatorio" ).not().isEmpty(),
    check( "activo","El activo del producto es obligatorio" ).not().isEmpty(),
    validarCampos
], actualizarDeposito)


router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id',"El id del producto no es ID valido").isMongoId() ,
    check('id').custom( existeCategoria ),
    validarCampos
], borrarDeposito)




module.exports = router;