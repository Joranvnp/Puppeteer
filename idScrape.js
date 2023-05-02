const puppeteer= require('puppeteer')
const fs = require('fs');
const functions = require('./fonctions/functions');
const writeParse = require('./fonctions/writeParseCSV');
const { count } = require('console');

var tabVues = []
const regexIdVues = /value="(.+?)"/g
const regexNameVues = /">(.+?)<\/option>/g
const regexLabel = /label=(.+?)"/g;

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        slowMo: 50,
    });
    var page = (await browser.pages())[0];
    await page.goto('https://partsfinder.softway.it/beta/');

    var csvImport = await functions.lectureCSV('Import/modele_beta.csv', 'Import/')

    for (var countModel=0; countModel < csvImport.length; countModel++) {

        // attente et click du selecteur de model
        await page.waitForSelector('#ricerca_filtro_modello > div > div.form-group.selectSwCustom > span > span.selection > span')
        await page.click("#ricerca_filtro_modello > div > div.form-group.selectSwCustom > span > span.selection > span")

        // attent et écrit le nom du modèle + presse entrée
        await page.waitForSelector("#body > span > span > span.select2-search.select2-search--dropdown > input")
        await page.type("#body > span > span > span.select2-search.select2-search--dropdown > input", csvImport[countModel]['modele'])
        await page.keyboard.press("Enter")

        var tab = []

        var categories = await page.$eval('#select_tavole', (element) => {return element.innerHTML})
        var tabCategorie = functions.regexRplSplitThis(categories, regexLabel, 'label="', '"')

        for (var countCat = 0; countCat < tabCategorie.length; countCat++) {

            // cadre
            // if (await page.$('#select_tavole > optgroup:nth-child(2)') !== null ){
                console.log(tabCategorie.length)
                // #select_tavole > optgroup

                if (tabCategorie.length == 1 ){
                    var data = await page.$eval('#select_tavole > optgroup', (element) => {return element.innerHTML})

                } else {
                    var nthChild = countCat+1
                    var data = await page.$eval('#select_tavole > optgroup:nth-child('+nthChild+')', (element) => {return element.innerHTML})
                }

                // var nthChild = countCat+1
                // var data = await page.$eval('#select_tavole > optgroup:nth-child('+nthChild+')', (element) => {return element.innerHTML})
                var IdVues = functions.regexRplSplitThis(data, regexIdVues, 'value="', '"')
                var NameVues = functions.regexRplSplitThis(data, regexNameVues, '">', '</option>')
    
                for (var countVues=0; countVues < IdVues.length; countVues++) {
                    tab['nameModele'] = csvImport[countModel]['modele']
                    tab['categorie'] = tabCategorie[0]
                    tab['nameVues'] = (NameVues[countVues])
                    tab['url'] = "https://partsfinder.softway.it/beta/draw/BT/"+csvImport[countModel]['id']+"/"+IdVues[countVues]
    
                    tabVues.push(tab)
                    tab = []
    
                }
    
            // }
            
        }

     
        

        // // moteur
        // if (await page.$('#select_tavole > optgroup:nth-child(3)') !== null ){
        //     var data = await page.$eval('#select_tavole > optgroup:nth-child(3)', (element) => {return element.innerHTML})

        //     var IdVues = functions.regexRplSplitThis(data, regexIdVues, 'value="', '"')
        //     var NameVues = functions.regexRplSplitThis(data, regexNameVues, '">', '</option>')

        //     for (var countVues=0; countVues < IdVues.length; countVues++) {
        //         // tab['annee'] = 
        //         tab['nameModele'] = csvImport[countModel]['modele']
        //         tab['categorie'] = tabCategorie[1]
        //         tab['nameVues'] = (NameVues[countVues])
        //         tab['url'] = "https://partsfinder.softway.it/beta/draw/BT/"+csvImport[countModel]['id']+"/"+IdVues[countVues]

        //         tabVues.push(tab)
        //         tab = []

        //     }
        // }

        //ecrit fichier csv export
        writeParse.writeParseCSV(tabVues)
        tabVues = []

    }

})()