import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public products: any;

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.api.getProducts().then((res: any) => {
      this.products = res;
    });
  }

}
