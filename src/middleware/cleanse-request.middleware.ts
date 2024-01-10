import { Request, Response, NextFunction } from 'express';

const cleanseRequest = (
  dataStore: 'query' | 'params' | 'body',
  expectedParams: Array<string>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cleansedQuery = {};

    expectedParams.forEach((key) => {
      if (req[dataStore][key] !== undefined) {
        cleansedQuery[key] = req[dataStore][key];
      }
    });

    req[dataStore] = cleansedQuery;
    next();
  };
};

export default cleanseRequest;
