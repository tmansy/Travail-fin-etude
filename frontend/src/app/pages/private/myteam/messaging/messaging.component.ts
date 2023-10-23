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

  constructor(private socket: Socket, private auth: AuthService, private activatedRoute: ActivatedRoute) {
    const token = this.auth.getToken();
    const config = { url: 'http://localhost:5555', options: { auth: { token } } };
    this.socket = new Socket(config);
   }

  ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.teamId = +params['teamId'];
    })

    const message = {
      messageText: "Je suis là",
      userId: localStorage.getItem('userId'),
      teamId: this.teamId,
    }

    this.socket.emit('sendMessage', message);
  }

}
