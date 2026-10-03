const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('mongodb connected')
  })
  .catch((error) => {
    console.log('error connecting to mongoDB', error)
  })

const phoneBookSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  phone: {
    type: String,
    minLength: 8,
    required: [true, 'User phone number required'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

phoneBookSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.number = returnedObject.phone
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Phone = mongoose.model('Phonebook', phoneBookSchema)

module.exports = Phone
