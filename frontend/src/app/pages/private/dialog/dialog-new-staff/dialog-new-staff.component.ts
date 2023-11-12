import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-new-staff',
  templateUrl: './dialog-new-staff.component.html',
  styleUrls: ['./dialog-new-staff.component.css']
})
export class DialogNewStaffComponent implements OnInit {
  public users: any;
  public formGroup = new FormGroup({
    username: new FormControl(),
    roleAssos: new FormControl(),
  });

  public roleAssociationLabel = ['Président', 'Vice-président', 'Secrétaire général', 'Trésorier', 'Ressources humaines', 'Responsable marketing', 'Responsable partenariat', 'Responsable des équipes', 'Responsable régie'];

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.api.getUsers().then((res: any) => {
      this.users = res.map((user: any) => ({
        label: user.username,
        value: user.username,
      }))
    })
  }

  public save() {
    if(this.formGroup.valid) {
      this.api.postStaff(this.formGroup.value).then((res: any) => {
        this.ref.close();
        this.api.success('L\'utilisateur a bien été ajouté aux membres du staff.');
      })
    }
    else {
      this.api.error('Formulaire invalide.');
    }
  }

}
