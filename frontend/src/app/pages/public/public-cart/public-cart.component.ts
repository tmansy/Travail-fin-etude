import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-cart',
  templateUrl: './public-cart.component.html',
  styleUrls: ['./public-cart.component.css']
})
export class PublicCartComponent {
  public myCart: any;
  public cartTotalPrice: any = 0;

  constructor(public router: Router, private api: ApiService, private ref: DynamicDialogRef, private cookieService: CookieService) { }

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

  public updateQuantity(product: any, action: string) {
    try {
      const newQuantity = action == "plus" ? product.quantity + 1 : product.quantity - 1;

      if(newQuantity < 0) {
        this.api.error('Impossible de mettre une quantité négative');
      }
      else if (newQuantity == 0) {
        this.myCart = this.myCart.filter((item: any) => {
          if(item.productId == product.productId && item.size != product.size) {
            return item;
          }
        });

        this.cartTotalPrice = 0;

        for(const product of this.myCart) {
          product.total_price = product.unit_price * product.quantity;
          this.cartTotalPrice = this.cartTotalPrice + product.total_price;
        }

        let myCartWithoutImage = this.myCart.map((product_cart: any) => {
          return {
            productId: product_cart.productId,
            label: product_cart.label,
            quantity: product_cart.quantity,
            size: product_cart.size,
            total_price: product_cart.total_price,
            unit_price: product_cart.unit_price,
          }
        });

        this.cookieService.delete('cart');
        this.cookieService.set('cart', JSON.stringify(myCartWithoutImage));
      }
      else {
        this.myCart = this.myCart.filter((item: any) => {
          if(item.productId == product.productId && item.size == product.size) {
            console.log('ic')
            item.quantity = newQuantity;
          }
          return item;
        });

        this.cartTotalPrice = 0;

        for(const product of this.myCart) {
          product.total_price = product.unit_price * product.quantity;
          this.cartTotalPrice = this.cartTotalPrice + product.total_price;
        }

        let myCartWithoutImage = this.myCart.map((product_cart: any) => {
          return {
            productId: product_cart.productId,
            label: product_cart.label,
            quantity: product_cart.quantity,
            size: product_cart.size,
            total_price: product_cart.total_price,
            unit_price: product_cart.unit_price,
          }
        });

        this.cookieService.delete('cart');
        this.cookieService.set('cart', JSON.stringify(myCartWithoutImage));
      }
    } catch (error) {
      console.log(error)
      console.error('Erreur lors de la modification de la quantité');
    }
  }

  public deleteProductCart(product: any) {

  }

  public placeOrder() {
    this.api.error('Vous devez vous connecter afin de valider votre panier');
    this.ref.close();

    this.router.navigate(['/connection']);
  }
}
