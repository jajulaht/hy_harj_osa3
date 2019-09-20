const express = require('express')
const app = express()

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

// Root
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Info
app.get('/info', (req, res) => {
  let info = persons.length
  let now = new Date()
  res.send(`<p>Phone book has info for ${info} people</p>
            <p>${now}</p>`
          )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})