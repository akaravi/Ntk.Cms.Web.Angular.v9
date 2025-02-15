import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-donate',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class DonateComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
