import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-web-designer',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class WebDesignerComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit(): void {
  }
}
