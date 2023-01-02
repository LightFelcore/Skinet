/* Standard Modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

/* Custom Components */
import { AppComponent } from 'src/app/app.component';

/* Custom Modules */
import { CoreModule } from 'src/app/core/core.module';
import { HomeModule } from 'src/app/home/home.module';
import { NgxSpinnerModule } from 'ngx-spinner';

/* Custom Interceptors */
import { ErrorInterceptor } from 'src/app/core/interceptors/error.interceptor';
import { LoadingInterceptor } from 'src/app/core/interceptors/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    NgxSpinnerModule
  ],
  providers: [
    // Error interceptor
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
