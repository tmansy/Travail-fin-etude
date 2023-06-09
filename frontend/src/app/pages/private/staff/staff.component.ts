import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { faSackDollar, faCrown, faGavel, faBookOpenReader, faChartLine, faUsers, faHandshake, faUsersCog, faCogs } from '@fortawesome/free-solid-svg-icons'
import { DialogService } from 'primeng/dynamicdialog';
import { DialogNewStaffComponent } from '../dialog/dialog-new-staff/dialog-new-staff.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  public users: any;
  public user: any;
  public loaded = false;
  public roleId: any;

  public faSackDollar = faSackDollar;
  public faCrown = faCrown;
  public faGavel = faGavel;
  public faBookOpenReader = faBookOpenReader;
  public faChartLine = faChartLine;
  public faUsers = faUsers;
  public faHandshake = faHandshake;
  public faUsersCog = faUsersCog;
  public faCogs = faCogs;

  public presidentUsers: any[] = [];
  public showPresidentUsers: boolean = false;
  public vicePresidentUsers: any[] = [];
  public showVicePresidentUsers: boolean = false;
  public generalSecretaryUsers: any[] = [];
  public showGeneralSecretaryUsers: boolean = false;
  public treasurerUsers: any[] = [];
  public showTreasurerUsers: boolean = false;
  public rhUsers: any[] = [];
  public showRhUsers: boolean = false;
  public marketingUsers: any[] = [];
  public showMarketingUsers: boolean = false;
  public partnerUsers: any[] = [];
  public showPartnerUsers: boolean = false;
  public teamUsers: any[] = [];
  public showTeamUsers: boolean = false;
  public managerUsers: any[] = [];
  public showManagerUsers: boolean = false;

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

    this.api.getUsers().then((res) => {
      this.users = res;

      this.presidentUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 3);
      });
      this.showPresidentUsers = this.presidentUsers.length > 0;

      this.vicePresidentUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 4);
      });
      this.showVicePresidentUsers = this.vicePresidentUsers.length > 0;

      this.generalSecretaryUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 5);
      });
      this.showGeneralSecretaryUsers = this.generalSecretaryUsers.length > 0;

      this.treasurerUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 6);
      });
      this.showTreasurerUsers = this.treasurerUsers.length > 0;

      this.rhUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 7);
      });
      this.showRhUsers = this.rhUsers.length > 0;

      this.marketingUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 8);
      });
      this.showMarketingUsers = this.marketingUsers.length > 0;

      this.partnerUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 9);
      });
      this.showPartnerUsers = this.partnerUsers.length > 0;

      this.teamUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 10);
      });
      this.showTeamUsers = this.teamUsers.length > 0;

      this.managerUsers = this.users.filter((user: any) => {
        return user.users_roles.some((ur: any) => ur.roleId === 11);
      });
      this.showManagerUsers = this.managerUsers.length > 0;

      console.log(this.managerUsers)
    })

    this.loaded = true;
  } 

  public staffDialog() {
    this.dialog.open(DialogNewStaffComponent, {
      header: "Ajouter un membre au staff",
      styleClass: 'custom-dialog',
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

}
