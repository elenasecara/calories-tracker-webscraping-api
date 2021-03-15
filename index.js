const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

var nutrition = []
var titlesArray = []
var myFunc = 0

app.get('/', function(req, res) {
    myFunc++
    console.log("myFunc: " + myFunc)

    // the scraping magic will happen here
    let title = req.query.title
    let recipeName = req.query.recipeName
    let carbsValue = req.query.carbsValue
    let mainTitle = req.query.mainTitle
    let link = req.query.link

    let url = 'https://www.bbcgoodfood.com/search/recipes?q=' + recipeName.replace(/\s+/g, '-').toLowerCase()

    var $;
    request(url, function(error, response, html) {
        if (!error) {
            $ = cheerio.load(html)
            title = $('div.post-header__body > h1.post-header__title').text()
            carbsValue = $('tbody.key-value-blocks__batch > tr.key-value-blocks__item')
            link = $('a.standard-card-new__article-title').attr('href')
            console.log("link: " + link)
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

            carbsValue.each(function() {
                const ntr = $(this).find('td.key-value-blocks__value').text();
                nutrition.push(ntr)
                if(nutrition.length > 8){
                    nutrition = []
                    nutrition.push(ntr)
                }
            })

            var json = {
                allTitles: titlesArray,
                id: 0,
                title: title,
                nutritions: nutrition
            }

            res.send(json)
        }
    })
})

app.listen('8000')
console.log('API is running on: http://localhost:8000/?recipeName=cupcakes')


module.exports = app