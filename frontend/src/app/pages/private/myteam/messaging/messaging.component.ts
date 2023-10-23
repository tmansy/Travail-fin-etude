import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  public teamId: number | undefined;
  public userId: number | undefined;
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

  constructor(private socket: Socket, private auth: AuthService, private activatedRoute: ActivatedRoute) {
    const token = this.auth.getToken();
    const config = { url: 'http://localhost:5555', options: { auth: { token } } };
    this.socket = new Socket(config);

    this.socket.on('newMessage', (newMessage: any) => {
      this.messages.push(newMessage);
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

    this.socket.emit('getAllMessages', this.teamId);

    this.socket.on('returnAllMessages', (messages: any) => {
      this.messages = messages;
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

}
