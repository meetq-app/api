import { Request, Response, NextFunction } from 'express';

const cleanseRequest = (
  dataStore: 'query' | 'params' | 'body',
  expectedParams: Array<string>,
  toArray: Array<string> = []
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cleansedQuery = {};

    expectedParams.forEach((key) => {
      if (req[dataStore][key] !== undefined) {
        cleansedQuery[key] = req[dataStore][key];
        if(toArray.includes(key) && !Array.isArray(cleansedQuery[key])){
          cleansedQuery[key] = [cleansedQuery[key]]
        }
      }
    });

    req[dataStore] = cleansedQuery;
    next();
  };
};

export default cleanseRequest;
