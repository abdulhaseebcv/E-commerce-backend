const express = require('express');
const app = express()
const cors = require('cors')
const db = require('./connection')
const userRouter = require('./routes/user')

//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.use('/', userRouter)


//MongoDB connection
db.connect((err) => err ? console.log(`Database connection error => ${err}`) : console.log('Database connected succesfully'))

//Server running
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running at ${PORT}`))

