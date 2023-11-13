import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-new-product',
  templateUrl: './dialog-new-product.component.html',
  styleUrls: ['./dialog-new-product.component.css']
})
export class DialogNewProductComponent {
  public formGroup = new FormGroup({
    label: new FormControl(),
    description: new FormControl(),
    price: new FormControl(),
    stock: new FormControl(),
    category: new FormControl(),
    image: new FormControl(),
  });
  public categories = ['Maillots', 'Vestes', 'Pulls', 'Tshirts', 'Pantalons', 'Joggings', 'Chaussures', 'Tapis de souris', 'Claviers', 'Casques', 'Chaises'];
  public selectedImage: string | null = null;
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

  constructor(private api: ApiService, private ref: DynamicDialogRef) {}

  ngOnInit(): void {
  }

  public createProduct() {
    if(this.formGroup.valid) {
      const category = this.formGroup.get('category')?.value;
      this.formGroup.get('category')?.setValue(this.mapCategoryToEnum(category));

      this.api.createProduct(this.formGroup.value).then(() => {
        this.ref.close();
        this.api.success('Le produit a été créé');
      });
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
