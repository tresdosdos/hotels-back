import { ExecutionContext, Inject, Injectable } from '@nestjs/common';

import { BadRequestError, PollKeyError } from '../../utils/errors';
import { Symbols } from '../../symbols';
import { Poll } from '../../db/models';

@Injectable()
export class PollGuard {
  constructor(@Inject(Symbols.Poll) private poll: typeof Poll) { }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (isNaN(+req.params.id)) {
      throw new BadRequestError();
    }

    const polls = await this.poll.findOne({where: {id: +req.params.id}});

    if (polls && polls.accessKey && polls.accessKey !== req.query.access_key) {
      throw new PollKeyError();
    }

    return true;
  }

  handleRequest(err, poll, info) {
    if (err || !poll) {
      throw err;
    }

    return poll;
  }
}
