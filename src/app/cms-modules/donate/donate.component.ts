import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donate',
  template: '<router-outlet></router-outlet>',
})
export class DonateComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
