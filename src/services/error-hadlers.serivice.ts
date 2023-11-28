import { Request, Response, NextFunction } from 'express';
import { respStatus } from '../enum/response.enum';
import { HelperService } from './helper.service';

class ErrorHandler {
  notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).send(HelperService.formatResponse(respStatus.FAILED, { error: 'Not found' }));
  }

  internalServerError(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('error message', err.message);
    console.error('error status', err.status);

    const status = err.status || 500;
    if (status === 500) {
      return res.status(status).send('something went wrong');
    }

    if (status === 400) {
      return res.status(status).send(
        HelperService.formatResponse(respStatus.FAILED, {
          error: err.message,
          details: err.details,
        }),
      );
    }

    res.status(status).send(err.message);
  }
}

export default new ErrorHandler();
