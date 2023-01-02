import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount: number = 0;

  constructor(
    private spinnerService: NgxSpinnerService,
  ) { }

  // In order to change spinner animation:
  // 1. Visit Load Awesome: https://labs.danielcardoso.net/load-awesome/animations.html and choose a spinner animation.
  // 2. anuglar.json: specify the .css file of the chosen animation by replacing the name
  // 3. <ngx-spinner type="ball-atom"></ngx-spinner>: specify the chosen type of animation as attribute

  busy(): void {
    this.busyRequestCount++;
    this.spinnerService.show();
  }

  idle() {
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide()
    }
  }
}
