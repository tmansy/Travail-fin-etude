import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-public-cart',
  templateUrl: './public-cart.component.html',
  styleUrls: ['./public-cart.component.css']
})
export class PublicCartComponent {
  public myCart: any;
  public cartTotalPrice: any;

  constructor(private api: ApiService, private cookieService: CookieService) { }

  async ngOnInit() {
    const cartString = this.cookieService.get('cart');
    this.myCart = JSON.parse(cartString);
    const products = await this.api.getProducts();

    // for(const product of this.myCart) {
    //   const matchingProduct = products.find((p) => p.id === product.id)
    //   product.image = 
    // }
  }

  isCartsProductsDefined() {
    return true;
    // return this.myCart && this.myCart.carts_products;
  }

  public updateQuantity(product: any, action: string) {

  }

  public deleteProductCart(product: any) {

  }

  public placeOrder() {

  }
}
