const express = require("express")
const articlesRouter = require('./routes/articles')
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));

//connecting mongo
const { MongoClient } = require('mongodb')
const uri = 'mongodb+srv://karan007316:test1234@cluster0.i8ap8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri)

async function main() {
  try {
    await client.connect();
    console.log("database connection established");
    
  } catch (error) {
    console.log(error);
  }
}
main();


app.set('view engine', 'ejs');
app.use('/articles', articlesRouter)

app.listen(3000, () => {
  console.log('server running');
})

//fetching and displaying all articles
app.get("/", async (req, res) => {
  const cursor = await client.db("blogs").collection("articles").find({}).sort({createdAt:-1})
  let articles = await cursor.toArray()
  
  res.render('articles/index', { articles: articles })
})