import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/* Custom Components */
import { LoginComponent } from 'src/app/account/login/login.component';
import { RegisterComponent } from 'src/app/account/register/register.component';
import { NotAuthGuard } from '../core/guards/not-auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { breadcrumb: "Login" }, canActivate: [NotAuthGuard] },
  { path: 'register', component: RegisterComponent, data: { breadcrumb: "Register" }, canActivate: [NotAuthGuard] }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
