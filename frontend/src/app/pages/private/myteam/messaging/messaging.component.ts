import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ApiService } from 'src/app/_services/api.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  public players: any;
  public teamId: number | undefined;
  public userId: number | undefined;
  public connectedUsers: number[] = [];
  public messages:  {
    id: number;
    messageText: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    teamId: number;
    user: {
      birthdate: Date;
      city: string;
      country: string;
      description: string;
      email: string;
      firstname: string;
      house_number: string;
      id: number;
      img: string;
      lastname: string;
      phone: string;
      rank: number;
      roleGame: number;
      street: string;
      title: string;
      username: string;
      zip_code: string;
    };
    team : {
      createdAt: Date;
      updatedAt: Date;
      description: string;
      display: number;
      id: number;
      logo: string;
      name: string;
    };
  }[] = [];
  public newMessage: string = '';

  constructor(private api: ApiService, private socket: Socket, private auth: AuthService, private activatedRoute: ActivatedRoute) {
    const token = this.auth.getToken();
    const config = { url: 'http://localhost:5555', options: { auth: { token } } };
    this.socket = new Socket(config);

    this.socket.on('newMessage', (newMessage: any) => {
      this.messages.push(newMessage);
    });

    this.socket.on('returnConnectedUsers', (users: number[]) => {
      this.connectedUsers = [];
      for(const user of users) {
        if(!this.connectedUsers.includes(user)) {
          this.connectedUsers.push(user);
        }
      }

      console.log(this.connectedUsers);
    });
   }

  ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.teamId = +params['teamId'];
    });

    const userIdString = localStorage.getItem('userId');
    if (userIdString !== null) {
      this.userId = parseInt(userIdString, 10);
    } 

    this.socket.emit('userConnected', this.userId);

    this.socket.emit('getAllMessages', this.teamId);

    this.socket.on('returnAllMessages', (messages: any) => {
      this.messages = messages;
    });

    this.api.getPlayersByTeam(this.teamId).then((res: any) => {
      this.players = res.map((player: any) => ({
        id: player.user.id,
        username: player.user.username,
      }));
    });

    window.addEventListener('beforeunload', (event) => {
      this.socket.emit('userDisconnect', this.userId);
    });
  }

  sendMessage(): void {
    if(this.newMessage != '') {
      const message = {
        messageText: this.newMessage,
        userId: localStorage.getItem('userId'),
        teamId: this.teamId,
      }
  
      this.socket.emit('sendMessage', message);
  
      this.newMessage = '';
    }
  }

  isUserConnected(userId: number): boolean {
    return this.connectedUsers.includes(userId);
  }

  ngOnDestroy(): void {
    this.socket.emit('userDisconnect', this.userId);
  }
}
