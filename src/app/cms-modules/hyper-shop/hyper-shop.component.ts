import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hypershop',
  template: '<router-outlet></router-outlet>',
})
export class HyperShopComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
