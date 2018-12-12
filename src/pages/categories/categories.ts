import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';
import { ItemsPage } from '../items/items';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  categories$: Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: ShoppingListProvider) {
    this.categories$ = provider.getAllCategories();
    
  }

  showItems(category) {
    this.navCtrl.push(ItemsPage, { category: category});
  }

}
