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

   /**Apollo Client has a mutate method that is similar to the watchQuery method we used before. 
    *  We provide it with the mutation mutationToggleItem that we defined above and we also give it the variables for the mutation.
    * In this case, we set the id of the item and we'll set the done variable to either true or false depending on what the previous value was.
    * The return value of the mutate method is an Observable so we need to subscribe to it to trigger it. 
    * I'm logging the response so you can see it in the Console and if there is an error that will be logged as well.
    * We don't need to manually update our in-memory cache because Apollo Client takes care of that for us.
    * We defined in our mutation that the backend should send us back the id and the done properties. 
    * Apollo Client will automatically identify the item in the cache by the id and subsequently update the done property.
    */

   //Sending Update item mutation to the backend with Apollo Client
   toggleItem(item: any) : void {
     this.apollo.mutate({
       mutation: mutationToggleItem,
       variables: {
         id: item.id,
         done: !item.done
       }
     })
     .subscribe(response => console.log(response.data), 
                  error => console.log("Mutation Error:", error));
   }


   //Sending Create item mutation to the backend with the Apollo Client
   createItem(name, categoryId) : void {
     this.apollo.mutate({
       mutation: mutationCreateItem,
       variables: {
         name: name,
         categoryId: categoryId
       },
       update: (proxy, { data: { createItem } }) => {

        //Read the data from the cache for the allItems query
        const data: any = proxy.readQuery({ query: queryAllItems});

        //Add the new item to the data
        data.allItems.push(createItem);

        //Write the data back to the cache for the allItems query
        proxy.writeQuery({ query: queryAllItems, data});
       }
     })
     .subscribe(response => console.log(response.data),
                 error => console.log('Mutation Error:', error));
   }


   //Manually update the cache to remove the deleted Item with the Apollo Client
   deleteItem(item: any): void {
     this.apollo.mutate({
       mutation: mutationDeleteItem,
       variables: {
         id: item.id
       },
       update: (proxy, { data: { deleteItem } }) => {

        //Read the data from the cache for the allItems query
        let data: any =  proxy.readQuery({ query: queryAllItems });

        //Remove the item from the data
        data.allItems =  data.allItems.filter(i => i.id !== deleteItem.id);

        //Write the data back to the cache for the allItems query
        proxy.writeQuery({ query: queryAllItems, data });
       }
     })
     .subscribe(response => console.log(response.data),
                error => console.log('Mutation Error:', error));
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

 //Update Item Mutation : update mutatuion when an item in the list is marked "done"
 const mutationToggleItem = gql`
  mutation($id: ID!, $done: Boolean) {
    updateItem(
      id: $id
      done: $done
    ) {
      id
      done
    }
  }
 `;

//Create Item Mutation
const mutationCreateItem = gql`
mutation ($name: String!, $categoryId: ID) {
  createItem(
    name: $name,
    done: false,
    categoryId: $categoryId
  ) {
    id
    name
    done
    category {
      id
    }
  }
}
`;

//Delete Item Mutation
const mutationDeleteItem = gql`
mutation($id: ID!) {
  deleteItem( id: $id ) {
    id
  }
}
`;




 
