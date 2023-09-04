import { Body, Controller, Get, Post, Req, Param, UseGuards } from '@nestjs/common';
import { PortalsService } from './portals.service';

@Controller('portals')
// @UseGuards(JwtAuthGuard)
export class PortalsController {
  constructor(private readonly portalsService: PortalsService) {}

  @Get('workspaces/all')
  async getAllWorkspaces(@Req() req) {
    const workspaces: any = await this.portalsService.getAllWorkspaces(req);
    console.log('workspaces', workspaces);
    return workspaces;
  }

  @Get('boards')
  async getAllBoards (@Req() req) {
    if (!req.query.ids) {
      return;
    }
    const boards: any = await this.portalsService.getAllBoards(req);
    return boards;
  }

  @Get(':listID/tasks')
  async getAllTasksOfLists(@Req() req) {
    try {
      const tasks: any = await this.portalsService.getAllTasksOfLists(req);
      return tasks;
    }
    catch(error) {
      console.log('list issue error', error);
      return error;
    }
  }

  @Post(':cardId/log')
  async addTimeLogForTasks(@Req() req) {
    const log: any = await this.portalsService.addTimeLogForTasks(req);
    return log;
  }

}
