import { Request, Response } from 'express';

export const setLocation = (req: Request, res: Response, path: string): void => {
  const prefix = req.get('x-forwarded-prefix');
  res.setHeader('Location', `${prefix}${path}`);
};
