import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core',
  template: '<router-outlet></router-outlet>',
})
export class CoreComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
