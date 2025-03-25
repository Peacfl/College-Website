const mongoose = require('mongoose')
const { marked } = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const domPurify = createDomPurify(new JSDOM().window)

//course schema
const courseSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    imageUrl: {  
        type: String,
        required: false
    },
    sanitizedHTML: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }

})

courseSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    if (this.markdown) {
        this.sanitizedHTML = domPurify.sanitize(marked(this.markdown))
    }
    next();
});


module.exports = mongoose.model('courses', courseSchema)