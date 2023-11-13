import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-delete-product',
  templateUrl: './dialog-delete-product.component.html',
  styleUrls: ['./dialog-delete-product.component.css']
})
export class DialogDeleteProductComponent {
  public product: any;

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.product = this.config.data;
  }

  ngOnInit(): void {
  }

  public delete(res: string) {
    if(res === 'Oui') {
      this.api.deleteProduct(this.product.id).then(() => {
        this.ref.close();
        this.api.success('Le produit a bien été supprimé');
      })
    }
    if(res === 'Non') {
      this.ref.close();
    }
  }
}
