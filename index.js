const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const nutrition = []
var myFCalls = 0;

app.get('/', function(req, res) {
    myFCalls++
    // the scraping magic will happen here
    let recipeName = req.query.recipeName
    let carbsValue = req.query.carbsValue

    let url = 'https://www.bbcgoodfood.com/recipes/' + recipeName
    console.log(url)
    console.log('The function has been called: ' + myFCalls)

    var $;
    request(url, function(error, response, html) {
        if (!error) {
            $ = cheerio.load(html)
            var prediction = $('div.header__body > h1.header__title').text()
            carbsValue = $('tbody.key-value-blocks__batch > tr.key-value-blocks__item')

            carbsValue.each(function() {
                const ntr = $(this).find('td.key-value-blocks__value').text();
                nutrition.push(ntr)
            })

            var json = {
                id: 0,
                // prediction: prediction,
                nutritions: [
                    { calories: nutrition[0] },
                    { fat: nutrition[1] },
                    { saturates: nutrition[2] },
                    { carbs: nutrition[3] },
                    { sugars: nutrition[4] },
                    { fibre: nutrition[5] },
                    { protein: nutrition[6] },
                    { salt: nutrition[7] }
                ]
            }

            res.send(json)
        }
    })
})

app.listen('8000')
console.log('API is running on: http://localhost:8000')


module.exports = app