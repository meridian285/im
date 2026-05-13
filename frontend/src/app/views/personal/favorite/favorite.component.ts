import {Component, Input, OnInit, Output} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoritesType} from "../../../../types/favorites.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  @Output() product: FavoritesType;
  @Input() countInCart: number | undefined = 0;
  count: number = 1;
  products: FavoritesType[] = [];
  serverStaticPath = environment.serverStaticPath;
  cart: CartType | null = null;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {

    this.product = {
      id: '',
      name: '',
      url: '',
      image: '',
      price: 0,
      countInCart: 0,
    }
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }

      this.cart = data as CartType;
      console.log('this.cart', this.cart)

      this.favoriteService.getFavorites()
        .subscribe((data: FavoritesType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          // this.products = data as FavoritesType[];
          const favoriteProducts = data as FavoritesType[];
          console.log('favoriteProducts', favoriteProducts)

          if (this.cart && this.cart.items.length > 0) {
            this.products = favoriteProducts.map(product => {
              if (this.cart) {
                const productInCart = this.cart.items.find(item => item.product.id === product.id);

                if (productInCart) {
                  product.countInCart = productInCart.quantity;
                }
              }
              return product;
            });
          } else {
            this.products = favoriteProducts;
          }
        });
    });


    console.log('this.product', this.products)
  }

  removeFromFavorites(id: string): void {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          // ...
          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id)
      })
  }

  addToCart(): void {
    // console.log('this.countInCart', typeof this.countInCart)
    // console.log('this.product.id', this.product)
    //
    //
    // this.cartService.updateCart(this.product.id, this.count)
    //   .subscribe((data: CartType | DefaultResponseType) => {
    //     if ((data as DefaultResponseType).error !== undefined) {
    //       throw new Error((data as DefaultResponseType).message);
    //     }
    //
    //     this.countInCart = this.count;
    //   });
  }

  removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = 0;
        this.count = 1;
      });
  }
}
