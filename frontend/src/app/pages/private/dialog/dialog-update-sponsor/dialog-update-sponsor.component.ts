import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-update-sponsor',
  templateUrl: './dialog-update-sponsor.component.html',
  styleUrls: ['./dialog-update-sponsor.component.css']
})
export class DialogUpdateSponsorComponent implements OnInit {
  public selectedImage: string | null = null;
  public sponsor: any;
  public formGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    website: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    logo: new FormControl(),
    banner: new FormControl(),
  })

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.sponsor = this.config.data;
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      name: this.sponsor.name,
      description: this.sponsor.description,
      website: this.sponsor.website,
      email: this.sponsor.email,
      phone: this.sponsor.phone,
    })
  }

  public handleImageLogoUpload(event: any) {
    const file = event.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.formGroup.get('logo')?.setValue(this.selectedImage);
    };

    reader.readAsDataURL(file); 
  }

  public handleImageBannerUpload(event: any) {
    const file = event.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.formGroup.get('banner')?.setValue(this.selectedImage);
    };

    reader.readAsDataURL(file); 
  }

  public updateSponsor() {
    if(this.formGroup.valid) {
      const formValues: any = {
        name : this.formGroup.get('name')?.value,
        description: this.formGroup.get('description')?.value,
        website: this.formGroup.get('website')?.value,
        email: this.formGroup.get('email')?.value,
        phone: this.formGroup.get('phone')?.value,
      }

      if(this.formGroup.get('logo')?.value != null){
        formValues.logo = this.formGroup.get('logo')?.value;
      }
      else if(this.formGroup.get('banner')?.value != null) {
        formValues.banner = this.formGroup.get('banner')?.value;
      }

      this.api.putSponsorData(this.sponsor.id, formValues).then(() => {
        this.ref.close();
        this.api.success('Les informations du sponsor ont bien été enregistrées')
      })
    }
    else {
      this.ref.close();
      this.api.error('Erreur dans le formulaire');
    }
  }

}
