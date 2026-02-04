import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';

@Controller('trpc')
export class TrpcController {
  @All('*')
  async handleTrpc(@Req() req: Request, @Res() res: Response) {
    const handler = trpcExpress.createExpressMiddleware({
      router: appRouter,
    });
    
    // Call the middleware with next function
    handler(req, res, (err?: any) => {
      if (err) throw err;
    });
  }
}
