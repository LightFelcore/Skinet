import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Custom Components */
import { HomeComponent } from 'src/app/home/home.component';
import { TestErrorComponent } from 'src/app/core/test-error/test-error.component';
import { NotFoundComponent } from 'src/app/core/not-found/not-found.component';
import { ServerErrorComponent } from 'src/app/core/server-error/server-error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'test-error', component: TestErrorComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule) },
  { path: '**', pathMatch: 'full', redirectTo: ''  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
