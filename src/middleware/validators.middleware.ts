import { Request, Response } from 'express';

import { validationResult  } from 'express-validator';

export const validators = (req: Request, res: Response, next:any) => {

  const result = validationResult(req);
  if (!result.isEmpty()){
    return res.status(400).json({
      errors: result.array()
    });   
  }
  next();

}