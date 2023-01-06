import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Custom Components */
import { LoginComponent } from 'src/app/account/login/login.component';
import { RegisterComponent } from 'src/app/account/register/register.component';

/* Custom Modules */
import { AccountRoutingModule } from 'src/app/account/account-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
