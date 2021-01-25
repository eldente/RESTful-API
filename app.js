const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//SETUP MONGODB: Connect to WikiDB
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

//CREATE NEW Article SCHEMA
const articleSchema = {
  title: String,
  content: String
};

//Creating Article MODEL
const Article = mongoose.model("Article", articleSchema);

//* * * * GET, POST & DELETE METHODS for ALL ARTICLES * * * *   (app.route method)
app.route("/articles")

  //Create GET route that fetches all the articles
  .get(function(req, res){
    //NEXT: With this we are going to: Query our DB and find all the docs inside Articles collection.
    //To to that we are going to specify THE MODEL NAME and use FIND method!
    Article.find(function(err, foundArticles){
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })     //NO ";" !!!!! (zato što se nastavlja)

  .post(function(req, res){
    //how to test?? We can write here console.log(req.body.title) for check (same for "content").

    //NEXT: CREATE METHOD: Save data from POST to DB!
    //first: create a NEWs ARTICLE (using the data "title" and "content"),
    //than SAVE it to DB.
    //if there were errors than send err back to CLIENT (else), and if not than tell client that is't ok (if)
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      };
    });
  })    //NO ";" !!!!!

  .delete(function(req, res){
    Article.deleteMany(function(err){
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      };
    });
  });

//* * * * GET, POST & DELETE METHODS for SPECIFIC ARTICLES * * * *   (app.route method)
app.route("/articles/:articleTitle")

  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })

  .put(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err) {
          res.send("Successfully updated artucle.")
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if (!err){
          res.send("Successfully updated article.")
        } else {
          res.rend(err);
        }
      }
    )
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err) {
          res.send("Successfully deleted the corresponding article.")
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
