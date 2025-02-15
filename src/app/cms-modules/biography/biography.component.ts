import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-biography',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class BiographyComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }
  ngOnInit(): void {
  }
}
