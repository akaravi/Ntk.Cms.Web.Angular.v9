import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalog',
  template: '<router-outlet></router-outlet>',
})
export class CatalogComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
