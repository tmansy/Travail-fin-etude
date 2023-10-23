import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  constructor(private socket: Socket, private auth: AuthService) {
    const token = this.auth.getToken();
    const config = { url: 'http://localhost:5555', options: { auth: { token } } };
    this.socket = new Socket(config);
   }

  ngOnInit(): void {
    this.socket.emit('message', 'JE SUIS LA');
  }

}
