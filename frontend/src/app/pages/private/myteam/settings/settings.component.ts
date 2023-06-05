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
  public team: any;
  public teamId: number | undefined;
  public loaded = false;
  public formGroup = new FormGroup({
    label: new FormControl(),
    description: new FormControl(),
    logo: new FormControl(),
    checked: new FormControl(),
  });
  public selectedImage: string | null = null;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.teamId = +params['teamId'];
    })

    this.api.getTeam(this.teamId).then((res: any) => {
      this.loaded = true;
      this.team = res;
      const formValues: any = {
        label: res.name,
        description: res.description,
        checked: res.display == 1 ? true : false,
      }
      this.formGroup.patchValue(formValues);
    })
  }

  public save() {
    console.log(this.formGroup.value);
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
