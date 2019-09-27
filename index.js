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
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Route for deleting a person
// Notice the conversion from string to number
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// Adding new contact info
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('IN', body)
  console.log('REQ', request.method)

  // Empty fields
  if (body.name === '' || body.number === '') {
    return response.status(400).json({ error: 'content missing' })
  }

  // Default fields
  if (body.name === 'Add a new name...' || body.number === 'Add a new number...') {
    return
  }

  // Create new contact
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

// Changing the number of contact
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

// Handler for unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Call handler for unknown routes
app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})