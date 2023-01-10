import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Custom Components */
import { HomeComponent } from 'src/app/home/home.component';
import { TestErrorComponent } from 'src/app/core/test-error/test-error.component';
import { NotFoundComponent } from 'src/app/core/not-found/not-found.component';
import { ServerErrorComponent } from 'src/app/core/server-error/server-error.component';

/* Custom Guards */
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },
  { path: 'test-error', component: TestErrorComponent, data: { breadcrumb: 'Test Errors' } },
  { path: 'server-error', component: ServerErrorComponent, data: { breadcrumb: 'Server Error' } },
  { path: 'not-found', component: NotFoundComponent, data: { breadcrumb: 'Not Found' } },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule), data: { breadcrumb: 'Shop' } },
  { path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule), data: { breadcrumb: 'Basket' } },
  { path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule), data: { breadcrumb: 'Checkout' }, canActivate: [AuthGuard] },
  // { breadcrumb: { skip: true } } ==> skip the breadcrum for account since we dont have an account component, only child routes
  { path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule), data: { breadcrumb: { skip: true } } },
  { path: 'orders', loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule), data: { breadcrumb: 'Orders' }, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
