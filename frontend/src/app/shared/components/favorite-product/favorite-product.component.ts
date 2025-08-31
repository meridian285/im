import {Component, Input, OnInit} from '@angular/core';
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteService} from "../../services/favorite.service";
import {FavoritesType} from "../../../../types/favorites.type";
import {CartService} from "../../services/cart.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {

  @Input()productFavorite!: FavoritesType;
  @Input() countInCart: number | undefined = 0;
  count: number = 1;
  productsFavorite: FavoritesType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) { }

  ngOnInit(): void {

  }

  removeFromFavorites(id: string) {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoritesType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.productsFavorite = data as FavoritesType[];
        console.log(this.productsFavorite)

        this.favoriteService.removeFavorite(id)
          .subscribe((data: DefaultResponseType) => {
            if (data.error) {
              // ...
              throw new Error(data.message);
            }

            this.productsFavorite = this.productsFavorite.filter(item => item.id !== id);
            console.log(this.productsFavorite)
          })
      })
  }

  addToCart(productId: string, quantity: number) {
    console.log(quantity)
    this.cartService.updateCart(productId, quantity)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = this.count;
      });
  }

  removeFromCart(productId: string) {
    this.cartService.updateCart(productId, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = 0;
        this.count = 1;
      });
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.productFavorite.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.countInCart = this.count;
        });
    }
  }
}
