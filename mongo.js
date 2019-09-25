const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

// If password is not given
if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

// Password
const password = process.argv[2]

// Add the password to the url
const url =
  `mongodb+srv://fullstack:${password}@cluster0-v50ml.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true ,useNewUrlParser: true })

// Schema for the contact info
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: ObjectId,
})

const Person = mongoose.model('Person', contactSchema)

// Two ways of calling the app, 
// first lists contacts, second adds a contact
if ( process.argv.length === 3 ) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
if ( process.argv.length === 5 ) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
    name: name,
    number: number
  })
  person.save().then(response => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  })
}