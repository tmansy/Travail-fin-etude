import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public loading: boolean = false;
  public formGroup = new FormGroup({
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl('', Validators.pattern(/^.{5,}$/)),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.pattern(/^(?=.*[A-Z]).{8,}$/)),
  })

  constructor(private router: Router, private api: ApiService, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  public register() {
    this.loading = true;
    if(this.formGroup.valid) {
      this.api.postSignup(this.formGroup.value).then((res: any) => {
        this.loading = false;
        if(res === "false") {
          this.api.error("Nom d'utilisateur ou adresse mail déjà utilisée.")
        }
        else {
          this.api.success('Félicitations vous êtes inscrit. Vous pouvez maintenant vous connecter.');
          this.router.navigateByUrl(`/connection`);
        }
      }).catch((err) => {
        this.loading = false;
        this.api.error(err);
      })
    }
    else if(this.formGroup.get('username')?.errors?.['pattern']) {
      this.loading = false;
      this.api.error('Le nom d\'utilisateur doit contenir au moins 5 caractères.');
    }
    else if(this.formGroup.get('email')?.errors?.['email']) {
      this.loading = false;
      this.api.error('Votre adresse email n\'est pas correcte.');
    }
    else if(this.formGroup.get('password')?.errors?.['pattern']) { 
      this.loading = false;
      this.api.error('Le mot de passe doit contenir au moins 8 caractère avec une majuscule et un caractère spécial.');
    }
    else {
      this.loading = false;
      this.api.error('Veuillez complétez le formulaire.')
    }
  }
}
