import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { DialogDeleteSponsorComponent } from '../dialog/dialog-delete-sponsor/dialog-delete-sponsor.component';
import { DialogUpdateSponsorComponent } from '../dialog/dialog-update-sponsor/dialog-update-sponsor.component';
import { DialogAddSponsorComponent } from '../dialog/dialog-add-sponsor/dialog-add-sponsor.component';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {
  public sponsors: any;
  public loaded = false;
  public user: any;
  public roleId: any;
  public sortField: string = "";
  public sortOrder: number = 0;

  constructor(private api: ApiService, private dialog: DialogService) { }

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

    this.api.getSponsors().then((res: any) => {
      this.sponsors = res;
    })

    this.loaded = true;
  }

  public sponsorDialog() {
    this.dialog.open(DialogAddSponsorComponent, {
      header: 'Ajouter un sponsor',
      styleClass: 'custom-dialog',
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

  public sponsorManagement(sponsor: any, action: string) {
    if(action === 'delete') {
      this.dialog.open(DialogDeleteSponsorComponent, {
        header: `Suppression d'un sponsor`,
        styleClass: 'custom-dialog',
        data: sponsor,
      }).onClose.subscribe(() => {
        this.ngOnInit();
      })
    }
    else if(action === 'modify') {
      this.dialog.open(DialogUpdateSponsorComponent, {
        header: 'Modification d\'un sponsor',
        styleClass: 'custom-dialog',
        data: sponsor,
      }).onClose.subscribe(() => {
        this.ngOnInit();
      })
    }
    else {
      this.api.error('Il y a une erreur inconnue veuillez recommencer');
    }
  }

}
