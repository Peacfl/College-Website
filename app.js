const express = require("express");
const bodyParser = require("body-parser");
const articlesRouter = require('./routes/articles')
const coursesRouter = require('./routes/courses')
const app = express();

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

app.use(express.static(__dirname));

app.set('view engine', 'ejs');
app.use('/notices', articlesRouter)
app.use('/courses', coursesRouter)


app.listen(3000, () => {
  console.log("Server started at port 3000");
})

app.get("/home", async (req, res) => {
  const cursor = await client.db("blogs").collection("notices").find({}).sort({ createdAt: -1 })
  let notices = await cursor.toArray()

  res.render("index", { notices: notices });
})

app.get("/sign-up", (req, res) => {
  res.sendFile(__dirname + "/sign-up.html");
})

app.get("/log-in", (req, res) => {
  res.sendFile(__dirname + "/log-in.html");
})

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/success.html");
})

app.get("/failure", (req, res) => {
  res.sendFile(__dirname + "/failure.html");
})

app.get("/about", (req, res) => {
  res.render("about");
})


app.get('/admin', async (req, res) => {
  
  const courseCursor = await client.db("blogs").collection("courses").find({})
  let courses = await courseCursor.toArray()
  const noticeCursor = await client.db("blogs").collection("notices").find({}).sort({ createdAt: -1 })
  let notices = await noticeCursor.toArray()

  //console.log(courses);
  res.render('admin', { course: courses, notices: notices })
})

app.get('/redirect', (req, res) => {
  res.redirect('/admin')
})