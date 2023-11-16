import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { DialogProductComponent } from '../../private/dialog/dialog-product/dialog-product.component';

@Component({
  selector: 'app-public-shop',
  templateUrl: './public-shop.component.html',
  styleUrls: ['./public-shop.component.css']
})
export class PublicShopComponent {
  public products: any;
  public maillots: any;
  public vestes: any;
  public pulls: any;
  public tShirts: any;
  public pantalons: any;
  public joggings: any;
  public chaussures: any;
  public tapisdesouris: any;
  public claviers: any;
  public casques: any;
  public chaises: any;

  constructor(public api: ApiService, private dialog: DialogService) { }

  ngOnInit(): void {
    this.api.getProducts().then((res: any) => {
      this.products = res;

      this.maillots = res.filter((product: any) => product.category == 0);
      this.vestes = res.filter((product: any) => product.category == 1);
      this.pulls = res.filter((product: any) => product.category == 2);
      this.tShirts = res.filter((product: any) => product.category == 3);
      this.pantalons = res.filter((product: any) => product.category == 4);
      this.joggings = res.filter((product: any) => product.category == 5);
      this.chaussures = res.filter((product: any) => product.category == 6);
      this.tapisdesouris = res.filter((product: any) => product.category == 7);
      this.claviers = res.filter((product: any) => product.category == 8);
      this.casques = res.filter((product: any) => product.category == 9);
      this.chaises = res.filter((product: any) => product.category == 10);
    });
  }

  public show(product: any) {
    this.dialog.open(DialogProductComponent, {
      header: `${product.label}`,
      styleClass: 'custom-dialog2',
      data: product,
      style: {
        'min-width': '1000px',
        'min-height': '400px',
      }
    }).onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
}
