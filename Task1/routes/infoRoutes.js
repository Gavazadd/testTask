const Router = require('express')
const router = new Router()
const addressInfoController = require('../controllers/addressInfoController')


router.get('/', addressInfoController.getInfo)



module.exports = router