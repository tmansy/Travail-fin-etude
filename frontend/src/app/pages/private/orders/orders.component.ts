import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import * as moment from 'moment';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public addressCheckbox1Checked: boolean = false;
  public addressCheckbox2Checked: boolean = false;
  public showNewAddress: boolean = false;
  public showCurrentAddress: boolean = false;
  public user: any;
  public formGroup = new FormGroup({
    zip_code: new FormControl(),
    street: new FormControl(),
    house_number: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
  });
  public formGroupVisa = new FormGroup({
    email: new FormControl(),
  })
  public paypalCheckboxChecked: boolean = false;
  public visaCheckboxChecked: boolean = true;
  public bancontactCheckboxChecked: boolean = false;
  public showPaypalDiv: boolean = false;
  public showVisaDiv: boolean = false;
  public showBancontactDiv: boolean = false;
  public stripe: any;
  public elements: any;
  public card: any;
  public displayError: any;
  public displaySuccess: any;
  public form: any;
  public isButtonDisabled: boolean = false;
  public myCart: any;
  public paymentIntent: any;
  public deliveryDate: string = '';

  constructor(private route: ActivatedRoute, public api: ApiService, public router: Router) {}

  async ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    this.stripe = await loadStripe('pk_test_51OBdckGIAsjLcmBQi1XphzLUTPo2eiSuSjmlyQ21OfJltmp9w8NBV7dI9t4rDPh1iCaeXWBajZx1s5zeBVKNKS3S009w8QQyJN');
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.displayError = document.querySelector('#card-errors');
    this.displaySuccess = document.querySelector('#card-success');
    this.form = document.querySelector("form");
    this.card.mount('#card-element');

    this.card.addEventListener('change', ({ error }: { error: any }) => {
      if(error) {
        this.displayError.textContent = error.message;
      }
      else {
        this.displayError.textContent = '';
      }
    });
    
    this.route.paramMap.subscribe(params => {  
      const state = window.history.state;
      this.myCart = state.myCart;
      this.paymentIntent = state.paymentIntent;
    });

    this.deliveryDate = moment().add(7, 'days').format('DD/MM/YYYY');
    this.visaCheckboxChecked = true;
  }

  public onAddressCheckbox1Change() {
    if (this.addressCheckbox1Checked) {
      this.addressCheckbox2Checked = false;
      this.showCurrentAddress = this.addressCheckbox1Checked.toString().includes('address1');
      this.showNewAddress = false;
    }
  }

  public onAddressCheckbox2Change() {
    if (this.addressCheckbox2Checked) {
      this.addressCheckbox1Checked = false;
      this.showNewAddress = this.addressCheckbox2Checked.toString().includes('address2');
      this.showCurrentAddress = false;
    }
  }

  public onPaypalCheckboxChange() {
    if(this.paypalCheckboxChecked) {
      this.visaCheckboxChecked = false;
      this.bancontactCheckboxChecked = false;
      this.showPaypalDiv = this.paypalCheckboxChecked.toString().includes('paypal');
      this.showVisaDiv = false;
      this.showBancontactDiv = false;
    }
  }

  public onVisaCheckboxChange() {
    if(this.visaCheckboxChecked) {
      this.paypalCheckboxChecked = false;
      this.bancontactCheckboxChecked = false;
      this.showVisaDiv = this.visaCheckboxChecked.toString().includes('visa');
      this.showPaypalDiv = false;
      this.showBancontactDiv = false;
    }
  }

  public onBancontactCheckboxChange() {
    if(this.bancontactCheckboxChecked) {
      this.paypalCheckboxChecked = false;
      this.visaCheckboxChecked = false;
      this.showBancontactDiv = this.bancontactCheckboxChecked.toString().includes('bancontact');
      this.showPaypalDiv = false;
      this.showVisaDiv = false;
    }
  }

  
  public async placeOrder() {
    if(this.addressCheckbox1Checked || this.addressCheckbox2Checked) {
      if(this.visaCheckboxChecked || this.paypalCheckboxChecked || this.bancontactCheckboxChecked) {
        if(this.isButtonDisabled == false) {
          this.isButtonDisabled = true;
    
          const result = await this.stripe.confirmCardPayment(`${this.paymentIntent.client_secret}`, {
            payment_method:  {
              card: this.card,
              billing_details: {
                email: this.user.email,
              }
            }
          });
    
          if(result.error) {
            this.displayError.textContent = result.error.message;
          }
          else {
            if (result.paymentIntent.status === 'succeeded') {
              let payment_method;
    
              if(this.paypalCheckboxChecked) payment_method = 0;
              else if (this.visaCheckboxChecked) payment_method = 1;
              else if (this.bancontactCheckboxChecked) payment_method = 2;
    
              const payment = {
                total_price: this.myCart.total_price,
                delivery_house_number: this.addressCheckbox2Checked ? this.formGroup.get('house_number')?.value : this.user.house_number,
                delivery_street: this.addressCheckbox2Checked ? this.formGroup.get('street')?.value : this.user.street,
                delivery_zip_code: this.addressCheckbox2Checked ? this.formGroup.get('zip_code')?.value : this.user.zip_code,
                delivery_city: this.addressCheckbox2Checked ? this.formGroup.get('city')?.value : this.user.city,
                delivery_country: this.addressCheckbox2Checked ? this.formGroup.get('country')?.value : this.user.country,
                userId: this.user.id,
                username: this.user.username,
                method: payment_method,
                paymentId: this.paymentIntent.paymentId,
                cartId: this.myCart.id,
                cart_products: this.myCart.carts_products,
              }
              
              this.form.reset();
              this.card.clear();

              await this.api.createOrder(payment);
              this.api.success('Votre commande a été effectuée, elle sera traitée dans les plus brefs délais.');
              this.router.navigate(['private/shop']);
            }
          }
    
          this.isButtonDisabled = false;
        }
      }
      else {
        this.api.error("Veuillez sélectionner votre moyen de paiement");
      }
    }
    else {
      this.api.error("Veuillez sélectionner votre adresse");
    }
  }
}
