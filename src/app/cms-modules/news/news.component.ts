import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-news',
  template: '<router-outlet></router-outlet>',
})
export class NewsComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }
  ngOnInit(): void {
  }
}
