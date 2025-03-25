const express = require('express')
const multer = require("multer");
const path = require("path");
const Course = require('./../models/courses')
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

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "public/uploads/"); // Store images in "public/uploads/"
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

//show all courses, THIS IS STATIC RIGHT NOW, MAKE SURE THE COURSES ACTUALLY GET RENDERED BY SPECIFIEND VARIABLES
router.get('/', async (req, res) => {
  const cursor = await client.db("blogs").collection("courses").find({})
  let courses = await cursor.toArray()
  
  //console.log(courses);
  res.render("courses/courses", {course : courses});
})

router.get('/new', (req, res) => {
  res.render('courses/new', { courses: new Course })
})

// router.get('/new', (req, res) => {
//   res.render('notices/new', { notice: new Notice })
// })

// router.get('/new', (req, res) => {
//   res.render('notices/new', { notice: new Notice })
// })

router.get('/:slug', async (req, res) => {

  const course = await client.db("blogs").collection("courses").findOne({ slug: req.params.slug });

  if (course == null) res.redirect("/home")
  
  res.render('courses/show', { courses: course  })
})

router.post('/', upload.single("image"), async (req, res) => {


  const url = req.file ? "/uploads/" + req.file.filename : "";

  let course = new Course({
    title: req.body.title,
    description: req.body.Description,
    markdown: req.body.Markdown,
    imageUrl: url
  })
  course.validate()

  try {
    course = await client.db("blogs").collection("courses").insertOne(course);
    course = await client.db("blogs").collection("courses").findOne({ _id: new ObjectId(course.insertedId) });
    //console.log(course);
    res.render('courses/new', { courses: course })
    
    //res.redirect(`/courses/${course.slug}`)
  } catch (e) {
    console.log(e);
    res.render('courses/new', { courses: course })
  }
})

router.post('/:id', async (req, res) => {
  await client.db("blogs").collection("courses").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect('/redirect')
})

module.exports = router