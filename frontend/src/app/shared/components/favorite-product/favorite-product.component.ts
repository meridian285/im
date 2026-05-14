import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {FavoritesType} from "../../../../types/favorites.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {

  @Input() product: FavoritesType;
  @Input() countInCart: number | undefined = 0;
  @Output() removeProduct: EventEmitter<string> = new EventEmitter<string>()
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;

  constructor(private cartService: CartService) {
    this.product = {
      id: '',
      name: '',
      url: '',
      image: '',
      price: 0,
      countInCart: 0
    }
  }

  ngOnInit(): void {
    if (this.product.countInCart && this.product.countInCart > 1) {
      this.count = this.product.countInCart;
    }
  }

  removeFromFavorites() {
    this.removeProduct.emit(this.product.id)
  }

  updateCount(value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.product.countInCart = this.count;
        });
    }
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.product.countInCart = this.count;
      });
  }

  removeFromCart(): void {
      this.cartService.updateCart(this.product.id, 0)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.product.countInCart = 0;
          this.count = 1;
        });
  }
}
