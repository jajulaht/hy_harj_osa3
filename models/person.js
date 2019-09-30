const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const ObjectId = mongoose.Schema.Types.ObjectId
const uniqueValidator = require('mongoose-unique-validator')

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false. (From Stackoverflow)
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)


mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Schema for the contact info
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, unique: true, minlength: 8 },
  id: ObjectId,
})

// Apply the uniqueValidator plugin to contactSchema
contactSchema.plugin(uniqueValidator)

// Transform returned contact infos
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', contactSchema)