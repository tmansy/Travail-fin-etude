import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private request: RequestService) {}

  getTeams() {
    return this.request.get('/teams');
  }

  getSponsors() {
    return this.request.get('/sponsors');
  }

  getTFTPlayers() {
    return this.request.get('/tftplayers');
  }

  postSendMail(data: any) {
    return this.request.post('/sendMail', data);
  }

  postLogin(data: any) {
    return this.request.post('/login', data);
  }

  postSignup(data: any) {
    return this.request.post('/signup', data);
  }

  getUser(userId: any) {
    return this.request.get(`/users/${userId}`);
  }

  success = (txt: string, duration?: number) => this.request.success(txt, duration);
  error = (txt: string, duration?: number) => this.request.error(txt, duration);
}
