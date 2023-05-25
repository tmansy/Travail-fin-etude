import { Component, OnInit } from '@angular/core';
import { Sponsor } from 'src/app/_classes/sponsor.model';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-sponsor-page',
  templateUrl: './sponsor-page.component.html',
  styleUrls: ['./sponsor-page.component.css']
})
export class SponsorPageComponent implements OnInit {
  public sponsors: Sponsor[] = [];
  public displayModal: boolean = false;
  public modalHeaderText: string = "";
  public modalBodyText: string = "";
  public modalUrl: string = "";
  public modalBanner: string = "";

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getSponsors().then((res: any) => {
      this.sponsors = res;
    });
  }

  public showModalDialog(sponsorToShow: Sponsor) {
    this.modalHeaderText = sponsorToShow.name;
    this.modalBodyText = sponsorToShow.description;
    this.modalUrl = sponsorToShow.website;
    this.modalBanner = sponsorToShow.banner;
    this.displayModal = true;
  }
}