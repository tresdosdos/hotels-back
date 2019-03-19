import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { UserService } from './user.service';
import { FileUploadInterceptor } from '../utils';
import { AccountConfirmError } from '../utils/errors';
import { JwtGuard } from './guards';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {
  }

  @Post('avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileUploadInterceptor)
  async updateAvatar(@UploadedFile() file, @Req() req, @Res() res) {
    const user = await this.userService.updateAvatar(req.user.email, file && file.secure_url);

    res.send(user);
  }

  @Get('')
  @UseGuards(JwtGuard)
  async getUser(@Req() req, @Res() res) {
    if (req.user.localUser && !req.user.localUser.confirmed) {
      throw new AccountConfirmError();
    }

    res.send(req.user);
  }

}
