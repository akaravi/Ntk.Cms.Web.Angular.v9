import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-config',
  template: '<router-outlet></router-outlet>',
})
export class EstateConfigComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
