import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FavoritesType} from "../../../types/favorites.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  getFavorites(): Observable<FavoritesType[] | DefaultResponseType> {
    return this.http.get<FavoritesType[] | DefaultResponseType>(environment.api + 'favorites');
  }
  removeFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId}});
  }
  addFavorite(productId: string): Observable<FavoritesType | DefaultResponseType> {
    return this.http.post<FavoritesType | DefaultResponseType>(environment.api + 'favorites', {productId});
  }
}
