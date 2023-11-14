import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-product',
  templateUrl: './dialog-product.component.html',
  styleUrls: ['./dialog-product.component.css']
})
export class DialogProductComponent {
  public product: any;
  public tailles = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  public formGroup = new FormGroup({
    taille: new FormControl(),
    quantity: new FormControl(),
  });
  public cart: {
    productId: number,
    size: string,
    quantity: number;
    unit_price: number;
    userId: number;
  } = {
    productId: 0,
    size: '',
    quantity: 0,
    unit_price: 0,
    userId: 0,
  };
  public user: any;

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.product = this.config.data;
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }
  }

  public addToCart() {
    if(!this.formGroup.get('taille')?.value) {
      this.api.error('Veuillez sélectionner une taille');
    }
    else {
      this.cart.productId = this.product.id;
      this.cart.size = this.formGroup.get('taille')?.value;
      this.cart.quantity = this.formGroup.get('quantity')?.value;
      this.cart.unit_price = this.product.price;
      this.cart.userId = this.user.id;

      this.api.postCartProduct(this.cart).then((res) => {
        this.ref.close();
        this.api.success('L\'article a été ajouté au panier');
      }).catch((err) => {
        this.api.error('Erreur lors de l\'ajout de l\'article dans le panier');
      })
    }
  }
}
