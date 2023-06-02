import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { AuthService } from '../../../_services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
  public loading: boolean = false;
  public formGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    checked: new FormControl(),
  })

  constructor(private router: Router, private api: ApiService, private authService: AuthService, private cookieService: CookieService) { }

  ngOnInit(): void {
    if(this.cookieService.get('checked') === 'true') {
      this.formGroup.patchValue({
        username: this.cookieService.get('username'),
        password: this.cookieService.get('password'),
        checked: true,
      })
    } 
  }

  public login() {
    this.loading = true;
    if(this.formGroup.valid) {
      this.api.postLogin(this.formGroup.value).then((res: any) => {
        this.loading = false;
        if(res === "false") {
          this.api.error('Le login ou le mot de passe n\'est pas correct.');
        }
        else {
          this.authService.setToken(res.token);
          localStorage.setItem('userId', res.user.id);
          localStorage.setItem('user', JSON.stringify(res.user));
          const checked = this.formGroup.get('checked')?.value;
          const username = this.formGroup.get('username')?.value;
          const password = this.formGroup.get('password')?.value;
          if(checked == true) {
            this.cookieService.set('checked', 'true');
            this.cookieService.set('username', username);
            this.cookieService.set('password', password);
          }
          else {
            this.cookieService.set('checked', 'false');
            this.cookieService.delete('username');
            this.cookieService.delete('password');
          }
          this.api.success('Félications vous êtes connecté.');
          this.router.navigateByUrl('/private/myspace');
        }
      }).catch((err) => {
        this.loading = false;
        this.api.error(err);
      })
    }
    else {
      this.loading = false;
      this.api.error('Veuillez complétez le formulaire.')
    }
  }
}
