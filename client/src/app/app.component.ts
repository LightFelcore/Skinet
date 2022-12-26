/* Standard Modules */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

/* Custom Interfaces */
import { IProduct } from 'src/app/models/product';
import { IPagination } from 'src/app/models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Observables
  products: IProduct[];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}` + "/products?pageSize=50").subscribe((response: IPagination) => {
      this.products = response.data;
    });
  }
}
