import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';

@Controller('trpc')
export class TrpcController {
  @All('*')
  async handleTrpc(@Req() req: Request, @Res() res: Response) {
    const handler = trpcExpress.createExpressMiddleware({
      router: appRouter,
    });
    
    return handler(req, res);
  }
}
