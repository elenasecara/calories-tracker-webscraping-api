const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

var nutrition = []
var myFunc = 0

app.get('/', function(req, res) {
    myFunc++
    console.log("myFunc: " + myFunc)

    // the scraping magic will happen here
    let title = req.query.title
    let recipeName = req.query.recipeName
    let carbsValue = req.query.carbsValue

    let url = 'https://www.bbcgoodfood.com/recipes/' + recipeName.replace(/\s+/g, '-').toLowerCase()
    console.log(url)

    var $;
    request(url, function(error, response, html) {
        if (!error) {
            $ = cheerio.load(html)
            title = $('div.post-header__body > h1.post-header__title').text()
            carbsValue = $('tbody.key-value-blocks__batch > tr.key-value-blocks__item')

            carbsValue.each(function() {
                const ntr = $(this).find('td.key-value-blocks__value').text();
                nutrition.push(ntr)
                if(nutrition.length > 8){
                    nutrition = []
                    nutrition.push(ntr)
                }
            })

            var json = {
                id: 0,
                title: title,
                nutritions: nutrition
            }

            res.send(json)
        }
    })
})

app.listen('8000')
console.log('API is running on: http://localhost:8000/?recipeName=flat-apple-vanilla-tart')


module.exports = app