import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  public myCart: any;
  public user: any;
  public cartTotalPrice: any;

  constructor(private route: ActivatedRoute, public api: ApiService, public router: Router) { }
  
  async ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    if (this.myCart === undefined) {
      try {
        const res = await this.api.getMyCart(this.user.id);
        this.myCart = res;
        this.cartTotalPrice = this.myCart.total_price;
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    }
    else {
      this.route.paramMap.subscribe(params => {  
        const state = window.history.state;
        this.myCart = state.myCart;
        this.cartTotalPrice = this.myCart.total_price;
  
      });
    }
  }

  isCartsProductsDefined() {
    return this.myCart && this.myCart.carts_products;
  }

  public async placeOrder() {
    if(this.myCart.carts_products.length == 0) {
      this.api.error('Votre panier est vide !');
    }
    else {
      let description: any = '';
      let paymentIntent: any;
      
      for(const descr of this.myCart.carts_products) {
        description += `${descr.quantity}x ${descr.product.label} ${descr.size} `;
      }

      const payment = {
        amount: this.myCart.total_price,
        currency: 1,
        description: description,
        statement_descriptor: "Achat boutique R4N",
        cartId: this.myCart.id,
      }

      await this.api.createPaymentIntent(payment).then((res: any) => {
        paymentIntent = res;
      });

      const navigationExtras: NavigationExtras = {
        state: {
          myCart: this.myCart,
          paymentIntent: paymentIntent,
        }
      };

      this.router.navigate([`/private/mycart/${this.myCart.id}/order`], navigationExtras);
    }
  }

  public async deleteProductCart(product: any) {
    try {
      await this.api.deleteCartProduct(product.id);
      this.refreshCartData();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit du panier :", error);
    }
  }

  public async updateQuantity(product: any, action: string) {
    try {
      const newQuantity = action == "plus" ? product.quantity + 1 : product.quantity - 1;

      if(newQuantity < 0) {
        this.api.error('Impossible de mettre une quantité négative');
      }
      else if (newQuantity == 0) {
        this.deleteProductCart(product);
      }
      else {
        product.quantity = newQuantity;
        
        await this.api.updateCartProduct(product.id, product);
        this.refreshCartData();
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la quantité');
    }
  }

  private async refreshCartData() {
    try {
      const res = await this.api.getMyCart(this.user.id);
      this.myCart = res;
      this.cartTotalPrice = this.myCart.total_price;
    } catch (error) {
      console.error("Erreur lors de la récupération du panier après suppression du produit :", error);
    }
  }
}