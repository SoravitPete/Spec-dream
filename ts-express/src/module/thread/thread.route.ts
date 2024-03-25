import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi'
import * as threadController from './thread.controller'

const router = express.Router()

const validateThread = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      context: Joi.string().required(),
    })

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    next();
  };

router.get('/', 
    threadController.getAll
)

router.post('/',
    validateThread,
    threadController.create
)

router.put('/',
    validateThread,
    threadController.update
)

router.delete('/',
    validateThread,
    threadController.deleteID
)

export default router