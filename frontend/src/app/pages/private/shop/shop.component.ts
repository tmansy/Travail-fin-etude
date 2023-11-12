import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { DialogProductComponent } from '../dialog/dialog-product/dialog-product.component';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public user: any;
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
  public myCart: any;

  constructor(public api: ApiService, private dialog: DialogService, public router: Router) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

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

    this.api.getMyCart(this.user.id).then((res: any) => {
      this.myCart = res;
    });
  }

  public goTo(product: any) {
    this.dialog.open(DialogProductComponent, {
      header: `${product.label}`,
      styleClass: 'custom-dialog2',
      data: product,
      style: {
        'min-width': '800px',
        'min-height': '400px',
      }
    }).onClose.subscribe(() => {
      this.ngOnInit();
    });
  }

  public goToMyCart() {
    if(!this.myCart) {
      this.api.error('Votre panier est vide !');
    }
    else {
      const navigationExtras: NavigationExtras = {
        state: {
          myCart: this.myCart
        }
      };

    this.router.navigate([`/private/mycart/${this.myCart.id}`], navigationExtras);
    }
  }
}
