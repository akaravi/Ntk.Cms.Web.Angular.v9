import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-sitecategory',
  template: '<router-outlet></router-outlet>',
})
export class CoreSiteCategoryComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
