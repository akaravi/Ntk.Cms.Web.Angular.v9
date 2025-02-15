import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-location',
  template: '<router-outlet></router-outlet>',
    standalone: false

})
export class CoreLocationComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
