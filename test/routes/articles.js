const express = require('express')
const Article = require('./../models/articles')
const router = express.Router()

//connecting mongo
const { MongoClient, ObjectId } = require('mongodb')
const uri = 'mongodb+srv://karan007316:test1234@cluster0.i8ap8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri)

async function main() {
  try {
    await client.connect();
    //console.log("working");

  } catch (error) {
    console.log(error);
  }
}
main();

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article })
})

router.get('/:slug', async (req, res) => {

  const article = await client.db("blogs").collection("articles").findOne({ slug: req.params.slug });

  if (article == null) res.redirect("/")

  res.render('articles/show', { article: article })
})

router.post('/', async (req, res) => {

  let article = new Article({
    title: req.body.title,
    description: req.body.Description,
    markdown: req.body.Markdown
  })
  article.validate()

  try {
    article = await client.db("blogs").collection("articles").insertOne(article);
    article = await client.db("blogs").collection("articles").findOne({ _id: new ObjectId(article.insertedId) });
    //console.log(article);
    
    res.redirect(`/articles/${article.slug}`)
  } catch (e) {
    console.log(e);
    res.render('articles/new', { article: article })
  }
})

router.post('/:id', async (req, res) => {
  await client.db("blogs").collection("articles").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect('/')
})

module.exports = router