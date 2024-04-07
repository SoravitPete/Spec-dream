import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi'
import * as userController from './user.controller'

const router = express.Router()

const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      accountName: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      mobileNo: Joi.string().allow('').optional(),
      birthday: Joi.string().isoDate().optional(),
      picture: Joi.string().allow('').optional(),
    })

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    next();
  };

router.get('/', 
    userController.getAll
)

router.post('/register',
    validateUser,
    userController.create
)

router.put('/',
    validateUser,
    userController.update
)

router.post('/login',
    userController.login
)

export default router