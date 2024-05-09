const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())

morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.use(express.json())

let persons = 
    [
        { 
          "id": 1,
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": 2,
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": 3,
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": 4,
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }
    ]
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
  const numberOfPersons = persons.length;
  const currentDate = new Date();
  const infoMessage = `
      <p>PhoneBook has info for ${numberOfPersons} people</p>
      <p>${currentDate}</p>
  `;
  response.send(infoMessage);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
const generateId = () => {
  const maxId = persons.length > 0 
  ? Math.max(...persons.map(p => p.id))
  : 0 
  return maxId + 1
}
app.post('/api/persons', (request, response) => {
  const body = request.body;

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  // Check if the name already exists in the phonebook
  const duplicateName = persons.find(person => person.name === body.name);
  if (duplicateName) {
    return response.status(400).json({ error: 'Name must be unique' });
  }

  // If all validations pass, create new entry
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };
  persons = persons.concat(person);
  response.json(person);
});


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})