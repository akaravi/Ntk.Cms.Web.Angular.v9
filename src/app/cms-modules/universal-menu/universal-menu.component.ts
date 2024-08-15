import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-universalmenu',
  template: '<router-outlet></router-outlet>',
})
export class UniversalMenuComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit(): void {
  }
}
