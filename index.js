const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

var nutrition = []
var titlesArray = []

// get food category -- based on general searching
app.get('/', function(req, res) {
    // the scraping magic will happen here
    let recipeName = req.query.recipeName
    let mainTitle = req.query.mainTitle

    let url = 'https://www.bbcgoodfood.com/search/recipes?q=' + recipeName.replace(/\s+/g, '-').toLowerCase()

    var $;
    request(url, function(error, response, html) {
        if (!error) {
            $ = cheerio.load(html)

            mainTitle = $('h4.standard-card-new__display-title')
            mainTitle.each(function() {
                const titles = $(this).find('a.standard-card-new__article-title').text()
                titlesArray.push(titles)
                
                //console.log(titles)
                if(titles.includes(recipeName))
                {
                    titlesArray = []
                    titlesArray.push(titles)
                }
                // check when to rewrite in the array
            })

            var json = {
                allTitles: titlesArray,
                id: 0
            }

            res.send(json)
        }
    })
})


// get recipe and nutrients -- based on specific searching
app.get('/nutrients/', function(req, res) {
    // the scraping magic will happen here
    let title = req.query.title
    let recipeName = req.query.recipeName
    let carbsValue = req.query.carbsValue

    let url = 'https://www.bbcgoodfood.com/recipes/' + recipeName.replace(/\s+/g, '-').toLowerCase()

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
                id: 1,
                title: title,
                nutritions: nutrition
            }

            res.send(json)
        }
    })
})
app.listen('8000')
console.log('API is running on: http://localhost:8000/?recipeName=cupcakes')
console.log('API is running on: http://localhost:8000/nutrients/?recipeName=cupcakes')

module.exports = app