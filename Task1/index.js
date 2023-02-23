require('dotenv').config()
const express = require('express')
const router = require('./routes/index')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use('/api',router)


const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}`))
    }catch (e){
        console.log(e)
    }
}

start()