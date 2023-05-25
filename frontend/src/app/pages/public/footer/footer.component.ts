import { Component, OnInit } from '@angular/core';
import { faDiscord, faTwitter, faTwitch, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faCoffee = faCoffee;
  faDiscord = faDiscord;
  faTwitter = faTwitter;
  faTwitch = faTwitch;
  faYoutube = faYoutube;
  faInstagram = faInstagram;

  constructor() { }

  ngOnInit(): void {
  }

}
