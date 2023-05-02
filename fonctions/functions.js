var loader = require('csv-load-sync');
const fs = require('fs');
const functions = require('./functions');

const lectureCSV = (file, pathFinal) => {
    var scraps ={}, cart = [];
    var exist = functions.verifCsv(file, pathFinal);

    if(exist == "exist"){ 
        var  csv  = loader(file);
        for(var i=0; i<csv.length; i++) {
            //Yearnpm
            scraps['id'] = csv[i]["id|name"].split('|')[0];
            scraps['modele'] = csv[i]["id|name"].split('|')[1];

            //push dans le tableau
            cart.push(scraps);
            scraps = [];        
        }

        return cart;
    }else{
        console.log("le fichier n'existe pas")
    }
}
module.exports.lectureCSV = lectureCSV;

const verifCsv = (newFile, pathFinal) => {
    //fonction recup chemin de toutes les fichiers du dossier Import
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
module.exports.verifCsv = verifCsv;

//fonction qui effectue une regex et deux replaces
const regexRplSplitThis = (stringToParse, regex, firstString, lastString) => { //replaceThis
    var tab= []
    var str = stringToParse.match(regex);

    if(str == null){
        str = [firstString+'vide'+lastString]
    }

    for(let k = 0; k<str.length; k++){
        var strRpl = str[k].split(firstString).join('')
        var strRpl2 = strRpl.split(lastString).join('')
        tab.push(strRpl2)
    }
    return tab;
};

module.exports.regexRplSplitThis = regexRplSplitThis;