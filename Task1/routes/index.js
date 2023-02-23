const Router = require('express')
const router = new Router()
const infoRouter = require('./infoRoutes')



router.use('/info', infoRouter)

module.exports = router