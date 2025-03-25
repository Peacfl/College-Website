const express = require('express')
const Notice = require('./../models/notices')
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
  res.render('notices/new', { notice: new Notice })
})

router.get('/:slug', async (req, res) => {

  const notice = await client.db("blogs").collection("notices").findOne({ slug: req.params.slug });

  if (notice == null) res.redirect("/home")
  
  res.render('notices/show', { notice: notice })
})

router.post('/', async (req, res) => {

  let notice = new Notice({
    title: req.body.title,
    description: req.body.Description,
    markdown: req.body.Markdown
  })
  notice.validate()

  try {
    notice = await client.db("blogs").collection("notices").insertOne(notice);
    notice = await client.db("blogs").collection("notices").findOne({ _id: new ObjectId(notice.insertedId) });
    //console.log(article);
    
    res.redirect(`/notices/${notice.slug}`)
  } catch (e) {
    console.log(e);
    res.render('notices/new', { notice: notice })
  }
})

router.post('/:id', async (req, res) => {
  await client.db("blogs").collection("notices").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect('/redirect')
})

module.exports = router