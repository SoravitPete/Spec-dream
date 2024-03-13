import express from 'express'
import * as userController from './user.controller'

const router = express.Router()

router.get('/', 
    userController.getAll
)

router.post('/',
    userController.create
)

router.post('/',
    userController.update
)

export default router