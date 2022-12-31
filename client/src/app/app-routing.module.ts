import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Custom Components */
import { HomeComponent } from 'src/app/home/home.component';
import { ProductDetailsComponent } from 'src/app/shop/product-details/product-details.component';
import { ShopComponent } from 'src/app/shop/shop.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule) },
  { path: '**', pathMatch: 'full', redirectTo: ''  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
