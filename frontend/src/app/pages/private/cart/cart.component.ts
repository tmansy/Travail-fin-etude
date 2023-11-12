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
  
  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    if(this.myCart == undefined) {
      this.api.getMyCart(this.user.id).then((res: any) => {
        this.myCart = res;
      });
    }
    
    this.route.paramMap.subscribe(params => {  
      const state = window.history.state;
      this.myCart = state.myCart;
      this.cartTotalPrice = this.myCart.total_price;
    });
  }

  public async placeOrder() {
    if(!this.myCart) {
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
}
