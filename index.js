require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function getBody (req) {
  let body = JSON.stringify(req.body)
  return body
})

// create "middleware", console log data
// Different format if method is POST
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', 
  { skip: (req) => { return req.method !== 'POST' }},
  { stream: console.log() }
))
app.use(morgan('tiny', {
  skip: (req) => { return req.method === 'POST' }
}))

// Route for root
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Route for info
app.get('/info', (req, res) => {
  let info = persons.length
  let now = new Date()
  res.send(`<p>Phone book has info for ${info} people</p>
            <p>${now}</p>`
          )
})

// Route for all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

// Route for individual person
// Returns 404 if no person with that id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Route for deleting a person
// Notice the conversion from string to number
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


// Adding new contact info
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('IN', body)
  console.log('REQ', request.method)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Please fill all required information' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})