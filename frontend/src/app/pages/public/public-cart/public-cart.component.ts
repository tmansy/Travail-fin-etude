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
  public cartTotalPrice: any = 0;

  constructor(private api: ApiService, private cookieService: CookieService) { }

  async ngOnInit() {
    const cartString = this.cookieService.get('cart');
    
    if(cartString) {
      this.myCart = JSON.parse(cartString);
      const products: any = await this.api.getProducts();

      for(const product of this.myCart) {
        const matchingProduct = products.find((p: any) => p.id === product.productId);
        product.image = matchingProduct.image;
        product.total_price = product.unit_price * product.quantity;
        this.cartTotalPrice = this.cartTotalPrice + product.total_price;
      }
    }
  }

  isCartsProductsDefined() {
    return this.myCart;
  }

  public async updateQuantity(product: any, action: string) {
    try {
      const newQuantity = action == "plus" ? product.quantity + 1 : product.quantity - 1;

      if(newQuantity < 0) {
        this.api.error('Impossible de mettre une quantité négative');
      }
      else if (newQuantity == 0) {
        let updatedCart = this.myCart.filter((item: any) => {
          if(item.productId == product.productId && item.size != product.size) {
            return item;
          }
        });

        await this.cookieService.delete('cart');
        await this.cookieService.set('cart', updatedCart);
      }
      else {
        // update quantity

      }
    } catch (error) {
      console.log(error)
      console.error('Erreur lors de la modification de la quantité');
    }
  }

  public deleteProductCart(product: any) {

  }

  public placeOrder() {

  }
}
