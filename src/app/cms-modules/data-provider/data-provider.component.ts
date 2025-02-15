import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-data-provider',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class DataProviderComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
