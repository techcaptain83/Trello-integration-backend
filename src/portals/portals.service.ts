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
    const { duration, status, description } = req.body;
    const time_url = `https://api.trello.com/1/cards/${cardId}/actions/comments`;
    const status_url = `https://api.trello.com/1/cards/${cardId}/idList`;
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
    
    const param = {
      key: api_key,
      token: token,
      value: status
    }

    try{

      const response = await this.httpService.axiosRef.post(time_url, null, {
        headers: headers,
        params: params
      });
      const json = response.data;

      const resp = await this.httpService.axiosRef.put(status_url, null, {
        params: param
      });
      const result = resp.data;
      return {json, result};
    } catch(error) {
      return error;
    }
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
    const api_key = this.configService.get('TRELLO_API_KEY');
    if (!req.query.ids) {
      return;
    }
    const data : any = [];
    for (let item of req.query.ids) {
        const url = `https://api.trello.com/1/lists/${item.id}/cards?key=${api_key}&token=${req.query.access_token}`
        const response = await fetch(url);
        const json = await response.json();
        const temp = {
          list_id: item.id,
          list_name: item.name,
          card: json
        }
        data.push(temp);
    }
    return data;
  }

  async getAllListsOfBoard(req: any) {
    const {boardID} = req.params;
    const url =`https://api.trello.com/1/boards/${boardID}/lists`;
    const api_key = this.configService.get('TRELLO_API_KEY');
    const params = {
      key: api_key,
      token: req.query.access_token
    };

    const response = await this.httpService.axiosRef.get(url, {
      params
    });
    const json = response.data;
    console.log(json);
    return json;
  }
}
