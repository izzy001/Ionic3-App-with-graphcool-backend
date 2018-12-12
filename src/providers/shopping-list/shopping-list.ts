/* import { HttpClient } from '@angular/common/http'; */
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

//Using the "graphql-tag" function to parse the query for fetching all items and turn it into a GraphQL document before passing it to Apollo Client
const queryAllItems = gql`
  query allItems {
    allItems {
      id
      name
      done
      category{
        id
      }
    }
  }
`;

/*
  Generated class for the ShoppingListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShoppingListProvider {

  constructor(private apollo: Apollo) {
    console.log('Hello ShoppingListProvider Provider');
  }

  getAllItems(): Observable<any> {
    //Used the "watchQuery" method to send the query to graphcool
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllItems
    });

    //response from the backend can be accessed here on the valueChanges property which is an Observable!
    return queryWatcher.valueChanges
    .pipe(map(result => result.data.allItems));; // to get the actual data, used map to get to  the allItems list

  }

  getAllCategories(): Observable<any> {
    //see Line 38
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllCategories
    });

    //see Line 43
    return queryWatcher.valueChanges
    .pipe(map(result => result.data.allCategories));; //to get the actual data, used map to get to the allCategories list
  }

   //The getItems(category) method implemented in the ItemsPage
   getItems(category: any) : Observable<any> {
     return this.getAllItems()
      .pipe(map(data => data.filter(i => i.category && i.category.id == category.id )));
   }
}


 //Using the "graphql-tag" function to parse the query for fetching the categories and turn it into a GraphQL document before passing it to Apollo Client

 const queryAllCategories = gql`
 query allCategories {
   allCategories {
     id
     name
   }
 }
 `;


 
