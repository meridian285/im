import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoComponent} from "./info/info.component";
import {FavoriteComponent} from "./favorite/favorite.component";
import {OrdersComponent} from "./orders/orders.component";

const routes: Routes = [
  {path: 'orders', component: OrdersComponent},
  {path: 'profile', component: InfoComponent},
  {path: 'favorite', component: FavoriteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
