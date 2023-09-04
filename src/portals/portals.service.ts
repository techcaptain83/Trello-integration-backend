import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class PortalsService {
  private readonly baseUrl = 'https://projectsapi.clickup.com.location/restapi';
  constructor(private readonly httpService: HttpService,
    private readonly configService: ConfigService, ) {}

  async addTimeLogForTasks(req) {
    const { cardId } = req.params;
    const { duration, billable, description } = req.body;
    const url = `https://api.trello.com/1/cards/${cardId}/actions/comments`;
    
    const api_key = this.configService.get('TRELLO_API_KEY');

    const headers = {
      'Accept': 'application/json',
    };
    const token = req.headers.access_token;
    const text = `${description} \n ${duration}s`
    
    const params = {
      key: api_key,
      token: token,
      text: text,
    };

    const response = await this.httpService.axiosRef.post(url, null, {
      headers: headers,
      params: params
    });
    const json = response.data;
    return json;
  }

  async getAllWorkspaces(req: any) {
    const api_key = this.configService.get('TRELLO_API_KEY');
    const url = `https://api.trello.com/1/members/me/organizations?key=${api_key}&token=${req.query.access_token}`
    const response = await fetch(url);
    const json = await response.json();
    const data = [];
    json?.map((item: any, index: number) => {
        const temp ={
          id: item.id,
          name: item.displayName,
          members: item.membersCount,
        }
        data.push(temp);
    })
    return data;
  }

  async getAllBoards(req: any) {
    const api_key = this.configService.get('TRELLO_API_KEY');
    if (!req.query.ids) {
      return;
    }
    const data : any = [];
    for (let item of req.query.ids) {
        const url = `https://api.trello.com/1/organizations/${item}/boards?key=${api_key}&token=${req.query.access_token}`
        const response = await fetch(url);
        const json = await response.json();
        const temp = {
          org_id: item,
          board: json
        }
        data.push(temp);
    }

    return data;
  }

  async getAllTasksOfLists(req: any) {
    const url = `https://api.trello.com/1/boards/${req.params.listID}/cards`
    const api_key = this.configService.get('TRELLO_API_KEY');

    const params = {
      key: api_key,
      token: req.query.access_token
    };
    
    const response = await this.httpService.axiosRef.get(url, {
      params
    });

    const json = response.data;
    return json;
  }
}
