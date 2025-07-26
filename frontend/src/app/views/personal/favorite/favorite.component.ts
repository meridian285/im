import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoritesType} from "../../../../types/favorites.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  productsFavorite: FavoritesType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoritesType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        const productsFavorite = data as FavoritesType[];

        this.cartService.getCart()
          .subscribe((data: CartType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }
            const cart = data as CartType;

            productsFavorite.forEach((favoriteItem, indexFavorite) => {
              const sameValues = cart.items.find(cartItem=> cartItem.product.id === favoriteItem.id);
              if (sameValues) {
                favoriteItem.quantity = sameValues.quantity;
                favoriteItem.countInCart = 1;
              } else {
                favoriteItem.quantity = 1;
              }
              this.productsFavorite.push(favoriteItem);
            })
          })
      });
  }
}
