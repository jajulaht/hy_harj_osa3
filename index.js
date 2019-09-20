const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

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

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  },
  { 
    "name": "Risto Reipas", 
    "number": "050-6423122",
    "id": 5
  }
]

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
app.get('/api/persons', (req, res) => {
  res.json(persons)
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

// Generating id
const generateId = () => {
  min = Math.ceil(0)
  max = Math.floor(100000)
  //The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

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

  if (persons.find( ({ name }) => name === body.name )) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }
  else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})