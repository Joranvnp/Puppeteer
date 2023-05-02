//https://www.w3schools.com/nodejs/nodejs_filesystem.asp
var fs = require('fs');


//fonction verifie si le fichier existe si oui alors on renvoi "exist" sinon rien
const verifCsvVue = (newFile) => {
    var pathFinal = "./export/"
    //fonction recup chemin de toutes les images du dossier image
    filesnames = fs.readdirSync(pathFinal)
    for(var t=0; t<filesnames.length; t++){
        var fileIdentical = filesnames[t]
        var file = pathFinal+fileIdentical
        if(file == newFile){
            var scrap = ['exist']
            break;
        }else{
            scrap = ['existpas']
        }
    }
    return scrap
}
module.exports.verifCsvVue = verifCsvVue;
