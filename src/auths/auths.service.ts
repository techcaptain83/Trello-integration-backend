import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { cloud } from '../conf';
import fetch from 'node-fetch';

@Injectable()
export class AuthsService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  getLoginUrl() {
    
    const state = Math.random().toString();
    
    // return `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=cLDX4jo5plesLQJP04h6h2DSHzAzAGys&scope=offline_access%20read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Fjira-integration-six.vercel.app%2Fjira%2Fcallback&state=${state}&response_type=code&prompt=consent`;
    const api_key = this.configService.get('TRELLO_API_KEY');
    const scope = this.configService.get('TRELLO_SCOPE');
    const app_name = this.configService.get('TRELLO_APP_NAME');
    const redirect_url = this.configService.get('TRELLO_CALLBACK_URL');
    return `https://trello.com/1/authorize?expiration=1day&name=${app_name}&scope=${scope}&response_type=token&key=${api_key}&return_url=${redirect_url}`;
  
  }

  async authorize(code: string) {
    const url = 'https://auth.atlassian.com/oauth/token';
    const data = {
      grant_type: 'authorization_code',
      client_id: 'cLDX4jo5plesLQJP04h6h2DSHzAzAGys',
      client_secret: 'ATOANXYmTVK9qCabBWqfa7pGDvNDGQG8pGIo9oVyHo0BvcdmXzY5VgufX2mPjWb1xQWh1E7E8472',
      code: code,
      redirect_uri: 'https://jira-integration-six.vercel.app/jira/callback'
    };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    const json = await response.json();

    return json;
  }

  async getProfile(access_token: string) {
    const url = 'https://api.trello.com/1/members/me/';

    const api_key = this.configService.get('TRELLO_API_KEY');
    const params = {
      key: api_key,
      token: access_token
    };
    
    const response = await fetch(`${url}?key=${api_key}&token=${access_token}`);

    const data = await response.json();
    return data;
  }
}
