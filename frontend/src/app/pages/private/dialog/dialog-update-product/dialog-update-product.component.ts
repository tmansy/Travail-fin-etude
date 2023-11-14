import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-update-product',
  templateUrl: './dialog-update-product.component.html',
  styleUrls: ['./dialog-update-product.component.css']
})
export class DialogUpdateProductComponent {
  public formGroup = new FormGroup({
    label: new FormControl(),
    description: new FormControl(),
    price: new FormControl(),
    stock: new FormControl(),
    category: new FormControl(),
    image: new FormControl(),
  });
  public selectedImage: string | null = null;
  public categories = ['Maillots', 'Vestes', 'Pulls', 'Tshirts', 'Pantalons', 'Joggings', 'Chaussures', 'Tapis de souris', 'Claviers', 'Casques', 'Chaises'];
  public product: any;
  public categoriesEnum: { [key: string]: number } = {
    'Maillots': 0,
    'Vestes': 1,
    'Pulls': 2,
    'Tshirts': 3,
    'Pantalons': 4,
    'Joggings': 5,
    'Chaussures': 6,
    'Tapis de souris': 7,
    'Claviers': 8,
    'Casques': 9,
    'Chaises': 10,
  }

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.product = this.config.data;
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      label: this.product.label,
      description: this.product.description,
      price: this.product.price,
      stock: this.product.stock,
      category: this.mapCategoriesToEnumName(this.product.category),
    });
  }

  public updateProduct() {
    if(this.formGroup.valid) {
      if(this.formGroup.get('label')?.value && this.formGroup.get('description')?.value
      && this.formGroup.get('price')?.value && this.formGroup.get('stock')?.value
      && this.formGroup.get('category')?.value) {
        const category = this.formGroup.get('category')?.value;
        this.formGroup.get('category')?.setValue(this.mapCategoryToEnum(category));

        this.api.updateProduct(this.product.id, this.formGroup.value).then(() => {
          this.ref.close();
          this.api.success('Le produit a été update');
        });
      }
      else {
        this.api.error('Tous les champs ne sont pas remplis');
      }
    }
    else {
      this.api.error('Données du formulaire invalide');
    }
  }

  public handleImageUpload(event: any) {
    const file = event.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.formGroup.get('image')?.setValue(this.selectedImage);
    };

    reader.readAsDataURL(file); 
  }

  mapCategoryToEnum(categories: string) {
    return this.categoriesEnum[categories];
  }

  mapCategoriesToEnumName(categoriesValue: number) {
    for(const key in this.categoriesEnum) {
      if(this.categoriesEnum[key] === categoriesValue) {
        return key;
      }
    }
    return '';
  }
}
