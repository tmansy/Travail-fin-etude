import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Requiem for a noob';
  public hideNavbarFooter: any;

  constructor(private router: Router) {}
  
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        const currentUrl = event.url;
        this.hideNavbarFooter = currentUrl === '/private/myspace' || currentUrl === '/private/teams' || currentUrl === '/private/staff' || currentUrl === '/private/requests' || currentUrl === '/private/sponsors' || currentUrl === '/private/users' || currentUrl === '/private/tournaments';
        if(this.hideNavbarFooter == false) {
          this.hideNavbarFooter = currentUrl.includes('/myteam/');
          this.hideNavbarFooter = currentUrl.includes('/mytournament/');
        }
      }
    });
  }
}
