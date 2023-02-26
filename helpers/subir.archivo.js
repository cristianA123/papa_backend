
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas=['png','jpg','jpeg','gif'], carpeta = '' ) => {


    return new Promise( (resolve, reject)=>{

        const {archivo} = files;
  
        const nombreCortado = archivo.name.split('.');
    
        const extension = nombreCortado[nombreCortado.length -1];
        
        // Validar la extension
        if( !extensionesValidas.includes( extension ) ){
            reject(`La extension ${ extension} no es permitida , porque no es ${ extensionesValidas }`);
        }
    
        const nombreTemp = uuidv4() + '.' +extension;
    
        const uploadPath = path.join(__dirname ,'../uploads/', carpeta, nombreTemp ) ;
        console.log(__dirname);
        
        
        archivo.mv(uploadPath, (err) => {
          if (err) {
              reject( err );
          }
          resolve(nombreTemp);
        });
    } )

    

}


module.exports = {
    subirArchivo
}
