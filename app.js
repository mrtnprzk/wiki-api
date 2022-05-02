//express
const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public')) //for CSS

//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//ejs 
const ejs = require('ejs');
app.set('view engine', 'ejs')

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB');

    //Schema
    const articleSchema = new mongoose.Schema({
        title: String,
        content: String
    });

    //Model
    const Article = mongoose.model('Article', articleSchema);


//Routes ----------------------------------------------------

//******************** Request Targeting all Articles ******************** 
app.route('/articles')

.get((req, res) => {    //get articles

    Article.find({}, function(err, foundArticles){
    if (!err) {
        // res.render('articles', {articlesWiki: foundArticles});
        res.send(foundArticles);
    } else {
        res.send(err);
    }
  });
})

.post((req, res) => {   //create articles

    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err) {
            res.send("Successfully added.");
        } else {
            res.send(err);
        }
    });
})

.delete((req, res) => {     //delete articles

    Article.deleteMany({}, function(err) {
        if (!err) {
            res.send("Successfully deleted.");
        } else {
            res.send(err);
        }
    })
});

//******************** Request Targeting a Specific Article ********************
app.route('/articles/:articleTitle')

.get((req, res) => {

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {

        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No Article matching title.");
        }
    })
})

.put((req, res) => {    //this will delete data and replace it with new
    Article.updateOne(
        {title: req.params.articleTitle},                       //what data are we going to update?
        {title: req.body.title, content: req.body.content},     //what we gonna change?
        (err) => {
            if (!err) {
                res.send('Successfully updated')
            } 
        }
    )
})

.patch((req, res) => {  //this will keep data and replace only specific think
    Article.updateOne(
        {title: req.params.articleTitle}, 
        {$set: req.body},
        (err) => {
            if (!err) {
                res.send('Successfully updated')
            }
        }
    )
})

.delete((req, ress) => {
    Article.deleteOne(
        {title: req.params.articleTitle}, 
        (err) => {
            if (!err) {
                res.send('Successfully deleted')
            } else {
                res.send(err)
            }
        }
    )
});


//-----------------------------------------------------------

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});