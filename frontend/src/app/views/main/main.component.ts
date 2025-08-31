import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../shared/services/product.service";
import {ProductType} from "../../../types/product.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {FavoritesType} from "../../../types/favorites.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {AuthService} from "../../core/auth/auth.service";
import {FavoriteService} from "../../shared/services/favorite.service";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../shared/utils/active-params.util";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  products: ProductType[] = [];
  favoriteProducts: FavoritesType[] | null = null;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  reviews = [
    {
      name: 'Ирина',
      image: 'review1.png',
      text: 'В ассортименте я встретила все комнатные растения, которые меня интересовали. Цены - лучшие в городе. Доставка - очень быстрая и с заботой о растениях. '
    },
    {
      name: 'Анастасия',
      image: 'review2.png',
      text: 'Спасибо огромное! Цветок арека невероятно красив - просто бомба! От него все в восторге! Спасибо за сервис - все удобно сделано, доставили быстро. И милая открыточка приятным бонусом.'
    },
    {
      name: 'Илья',
      image: 'review3.png',
      text: 'Магазин супер! Второй раз заказываю курьером, доставлено в лучшем виде. Ваш ассортимент комнатных растений впечатляет! Спасибо вам за хорошую работу!'
    },
    {
      name: 'Аделина',
      image: 'review4.jpg',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
    },
    {
      name: 'Яника',
      image: 'review5.jpg',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      name: 'Марина',
      image: 'review6.jpg',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
    },
    {
      name: 'Станислав',
      image: 'review7.jpg',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
    }
  ]

  constructor(private productService: ProductService,
              private authService: AuthService,
              private favoriteService: FavoriteService,
              private activatedRouter: ActivatedRoute,) {
  }

  ngOnInit(): void {
    // console.log('activatedRouter.snapshot.url - ', this.activatedRouter.snapshot.url)
    // this.productService.getBestProducts()
    //   .subscribe((data: ProductType[]) => {
    //     this.products = data;
    //   })

    if (this.authService.getIsLoggedIn()) {
      this.favoriteService.getFavorites()
        .subscribe(
          {
            next: (data: FavoritesType[] | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                this.processCatalog();
                throw new Error(error);
              }

              this.favoriteProducts = data as FavoritesType[];
              this.processCatalog();
            },
            error: (error) => {
              this.processCatalog();
            }
          });
    } else {
      this.processCatalog();
    }
  }

  processCatalog() {
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.products = data;

        if (this.favoriteProducts) {
          this.products = this.products.map((product: ProductType) => {
            const productInFavorite = this.favoriteProducts?.find(item => item.id === product.id);
            if (productInFavorite) {
              product.isInFavorite = true;
            }
            return product;
          })
        }
      });
  }
}
