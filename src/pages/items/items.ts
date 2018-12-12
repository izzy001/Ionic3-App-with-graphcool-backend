import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';
import { NewItemPage } from '../new-item/new-item';

/**
 * Generated class for the ItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {

  items$: Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: ShoppingListProvider, public modalCtrl: ModalController) {
    /**Display either all items or only items that belong to a selected category */
    const category = navParams.get("category");

    if(category) {
      this.items$ = provider.getItems(category);
    } else {
      this.items$ = provider.getAllItems();
    }
   
  }

  toogle(item){
    this.provider.toggleItem(item);
  }

  goToAddItem() {
    const modal = this.modalCtrl.create(NewItemPage);
    modal.present();
  }

  delete(item) {
    this.provider.deleteItem(item);
  }

}
