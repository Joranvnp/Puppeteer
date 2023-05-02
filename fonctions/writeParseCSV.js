//https://www.npmjs.com/package/json2csv
let converter = require('json-2-csv');
//https://www.w3schools.com/nodejs/nodejs_filesystem.asp
var fs = require('fs');

//https://www.npmjs.com/package/replace-in-file
const replace = require('replace-in-file');

//appel fichier
const functions_vue = require('./fonctions_vue')

const writeParseCSV = (tab) =>{
	var listeproduct = [];
	

	for(count = 0; count < tab.length; count++){
		//si le fichier exist

			var nameModele = tab[count]['nameModele']
			var categorie = tab[count]['categorie']
			var nameVues = tab[count]['nameVues']
			var url = tab[count]['url']
			

			var product = {
				nameModele: nameModele,
				categorie: categorie,
				nameVues: nameVues,
				url: url,	
			}
		listeproduct.push(product);
	
	}

	if(listeproduct.length > 0){
		// Génération du fichier Maj_stock_prix_canam.csv
		let json2csvCallback1 = function (err, csv) {
			if (err) throw err;
			if(prependHeader == true){
				csv = csv
			}else{
				csv = "\n"+csv
			}
			fs.appendFile('Export/file_url_export.csv',csv, 'utf8', function (err) {//'+Dates+'
				if(err){
					console.log('Erreur, vérifier que le fichier ne soit pas ouvert.');
				}
				else{
					console.log('CSV de link OK !');
				}
			});
		};

		var verif = functions_vue.verifCsvVue('./Export/file_url_export.csv')
				
		if(verif == 'exist'){
			var prependHeader = false; // ne génère pas  l'entête du fichier automatiquement
		}else{
			var prependHeader = true; // génère l'entête du fichier automatiquement
		}
		converter.json2csv(listeproduct, json2csvCallback1, {
			prependHeader: prependHeader, // génère l'entête du fichier automatiquement
			delimiter: {
				field: '|',			
			}
		});
	}
}
module.exports.writeParseCSV = writeParseCSV;  