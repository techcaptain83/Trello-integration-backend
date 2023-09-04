import { AuthsService } from './auths.service';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthsService) {}

  @Get('/trello') 
  jiraLogin(@Res() res) {
    res.redirect(this.authService.getJiraLoginUrl());
  }

  @Get('/callback') 
  async jiraCallback(@Req() req) {
    try {
      // const data = await this.authService.authorize(req.query.code);
      // return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('/profile')
  // @UseGuards(JwtAuthGuard)
  async profile(@Req() req) {
    try {
      return this.authService.getProfile(req.query.access_token);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
