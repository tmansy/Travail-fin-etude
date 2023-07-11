import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-add-sponsor',
  templateUrl: './dialog-add-sponsor.component.html',
  styleUrls: ['./dialog-add-sponsor.component.css']
})
export class DialogAddSponsorComponent implements OnInit {
  public formGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    website: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    logo: new FormControl(),
    banner: new FormControl(),
  });
  public selectedImage: string | null = null;

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  public createSponsor() {
    if(this.formGroup.valid) {
      this.api.postSponsor(this.formGroup.value).then(() => {
        this.ref.close();
        this.api.success('Un nouveau sponsor a été ajouté');
      }).catch((err) => {
        this.api.error(err);
      })
    }
    else {
      this.api.error('Erreur dans le formulaire');
    }
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

}
