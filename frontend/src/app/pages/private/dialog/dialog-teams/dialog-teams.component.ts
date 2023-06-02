import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-teams',
  templateUrl: './dialog-teams.component.html',
  styleUrls: ['./dialog-teams.component.css']
})
export class DialogTeamsComponent implements OnInit {
  public formGroup = new FormGroup({
    name: new FormControl(),
    logo: new FormControl(),
    description: new FormControl(),
  })
  public selectedImage: string | null = null;

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  public createTeam() {
    if(this.formGroup.valid) {
      this.api.postNewTeam(this.formGroup.value).then((res: any) => {
        this.ref.close();
        this.api.success('Une nouvelle équipe a bien été créée.');
      }).catch((err) => {
        this.api.error(err);
      })
    }
    else {
      this.api.error('Erreur dans le formulaire.');
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
