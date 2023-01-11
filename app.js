const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const mongodb_password = process.env.MONGODB_PASSWORD
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:'+mongodb_password+'@cluster0.3goysx3.mongodb.net/?retryWrites=true&w=majority');

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model('Article', articleSchema);


app.route('/articles')
  .get(function(req, res) {
    Article.find({}, function(err, articles) {
      if (err) res.send(err);
      else {
        res.send(articles);
      };
    });
  })
  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save(function(err, article) {
      if (err) res.send(err);
      else res.send(article);
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) res.send(err);
      else res.send("Successfuly deleted all articles!");
    });
  });


app.route("/articles/:title")
 .get(function(req, res) {
    Article.findOne({title: req.params.title}, function(err, article) {
      if (err) res.send(err);
      else res.send(article);
    });
  })
  .put(function(req, res) {
    Article.findOneAndUpdate({title: req.params.title}, {title: req.body.title, content: req.body.content}, function(err) {
      if (err) res.send(err);
      else res.send("Successfuly updated article");
    });
  })
  .patch(function(req, res) {
    Article.findOneAndUpdate({title: req.params.title}, {$set: {title: req.body.title, content: req.body.content}}, function(err) {
      if (err) res.send(err);
      else res.send("Successfuly updated article");
    });
  })
  .delete(function(req, res) {
    Article.findOneAndDelete({title: req.params.title}, function(err) {
      if (err) res.send(err);
      else res.send("Successfuly deleted article");
    });
  });



app.listen(3000, function() {
    console.log("Server started on port 3000");
});