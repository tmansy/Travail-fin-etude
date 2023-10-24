import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { DialogRequestComponent } from '../dialog/dialog-request/dialog-request.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  public user: any;
  public tabsArray!: MenuItem[];
  public activeItem!: MenuItem;
  public pendingRequests: any[] = [];
  public acceptedRequests: any[] = [];
  public refusedRequests: any[] = [];
  public selectedRequest: any;

  constructor(private api: ApiService, private dialog: DialogService) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if(userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    this.tabsArray = [
      { label: 'En attente' },
      { label: 'Acceptée' },
      { label: 'Refusée' },
    ]
    this.activeItem = this.tabsArray[0];

    this.api.getRequests().then((res: any) => {
      this.pendingRequests = res.filter((request: any) => request.status === 2);
      this.acceptedRequests = res.filter((request: any) => request.status === 0);
      this.refusedRequests = res.filter((request: any) => request.status === 1);
    })
  }

  public onRowSelect(event: any) {
    this.dialog.open(DialogRequestComponent, {
      header: `Récapitulatif demande d'affiliation`,
      styleClass: 'custom-dialog',
      data: event.data,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

}
