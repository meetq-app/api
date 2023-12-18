import { Request, Response, NextFunction } from 'express';
import { respStatus } from '../enum/response.enum';
import { HelperService } from './helper.service';

class ErrorHandler {
  notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).send(HelperService.formatResponse(respStatus.FAILED, { error: 'Not found', type: 'NotFound' }));
  }

  internalServerError(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('error message', err.message);
    console.error('error status', err.status);

    const status = err.status || 500;
    if (status === 500) {
      return res.status(status).send('something went wrong');
    }

    return res.status(status).send(
      HelperService.formatResponse(respStatus.FAILED, {
        error: err.message,
        type: err.name,
        details: err.details,
      }),
    );
  }
}

export default new ErrorHandler();
