import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public user: any;
  public team: any;
  public teamId: number | undefined;
  public loaded = false;
  public formGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    logo: new FormControl(),
    checked: new FormControl(),
  });
  public selectedImage: string | null = null;
  public roleId: any;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    const roleIdString = localStorage.getItem('roleId');
    if (roleIdString !== null) {
      const roleId = JSON.parse(roleIdString);
      this.roleId = roleId;
    }
    
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.teamId = +params['teamId'];
    })

    this.api.getTeam(this.teamId).then((res: any) => {
      this.loaded = true;
      this.team = res;
      const formValues: any = {
        name: res.name,
        description: res.description,
        checked: res.display == 1 ? true : false,
      }
      this.formGroup.patchValue(formValues);
    })
  }

  public save() {
    if(this.formGroup.valid) {
      if(this.formGroup.get('logo')?.value == null) {
        const formValues: any = {
          name: this.formGroup.get('name')?.value,
          description: this.formGroup.get('description')?.value,
          checked: this.formGroup.get('checked')?.value ? 1 : 0,
        }
        this.api.putTeamInfos(this.teamId, formValues).then((res: any) => {
          this.api.success('Les informations de l\'équipe ont bien été enregistrées.');
        })
      }
      else {
        this.api.putTeamInfos(this.teamId, this.formGroup.value).then((res: any) => {
          this.ngOnInit();
          this.api.success('Les informations de l\'équipe ont bien été enregistrées.');
        })
      }
    } 
    else {
      this.api.error('Formulaire invalide');
    }
  }

  public handleImageUpload(event: any) {
    const file = event.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.formGroup.get('logo')?.setValue(this.selectedImage);
    };

    reader.readAsDataURL(file); 
  }

}
