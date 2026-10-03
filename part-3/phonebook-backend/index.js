require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Phone = require('./models/phones')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body',
  ),
)

app.get(['/phone', '/api/persons'], (_req, res, next) => {
  Phone.find({})
    .then((phones) => {
      res.json(phones)
    })
    .catch((error) => next(error))
})

app.get('/info', (_req, res, next) => {
  Phone.find({})
    .then((phones) => {
      res.send(`
                <p>Phonebook has info for ${phones.length} people</p>
                <p>${new Date()}</p>
            `)
    })
    .catch((error) => next(error))
})

app.get(['/phone/:id', '/api/persons/:id'], (req, res, next) => {
  Phone.findById(req.params.id)
    .then((phone) => {
      if (phone) {
        res.json(phone)
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

app.delete(['/phone/:id', '/api/persons/:id'], (req, res, next) => {
  Phone.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post(['/phone', '/api/persons'], (req, res, next) => {
  const body = req.body

  const phone = new Phone({
    name: body?.name,
    phone: body?.phone || body?.number,
  })

  phone
    .save()
    .then((savedPhone) => {
      res.status(201).json(savedPhone)
    })
    .catch((error) => next(error))
})

app.put(['/phone/:id', '/api/persons/:id'], (req, res, next) => {
  const { name, phone, number } = req.body || {}

  const updatedData = {}
  if (name !== undefined) updatedData.name = name
  if (phone !== undefined) updatedData.phone = phone
  else if (number !== undefined) updatedData.phone = number

  Phone.findByIdAndUpdate(req.params.id, updatedData, {
    returnDocument: 'after',
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, _req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Running server on port: ${PORT}`)
})
