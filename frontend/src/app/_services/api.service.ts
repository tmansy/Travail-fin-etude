import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public team: any;

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

  getUsers() {
    return this.request.get('/users');
  }

  putUserInfos(userId: any, data: any) {
    return this.request.put(`/user_infos/${userId}`, data);
  }

  getTeamsByPlayer(userId: any) {
    return this.request.get(`/teams_by_player/${userId}`);
  }

  postNewTeam(data: any) {
    return this.request.post(`/create_team`, data);
  }

  getTeam(teamId: any) {
    return this.request.get(`/teams/${teamId}`);
  }

  putTeamInfos(teamId: any, data: any) {
    return this.request.put(`/teams/${teamId}`, data);
  }

  getPlayersByTeam(teamId: any) {
    return this.request.get(`/players_by_team/${teamId}`);
  }

  putPlayerInfos(userId: any, data: any) {
    return this.request.put(`/playerInfos/${userId}`, data);
  }

  postPlayer(data: any) {
    return this.request.post('/add_new_player', data);
  }

  postStaff(data: any) {
    return this.request.post('/add_staff_member', data);
  }

  deleteStaff(data: any) {
    return this.request.put(`/delete_staff_member`, data);
  }

  getRequest(userId: any) {
    return this.request.get(`/membership_request/${userId}`);
  }

  postMembershipRequest(data: any) {
    return this.request.post('/membership_request', data);
  }

  success = (txt: string, duration?: number) => this.request.success(txt, duration);
  error = (txt: string, duration?: number) => this.request.error(txt, duration);
}
