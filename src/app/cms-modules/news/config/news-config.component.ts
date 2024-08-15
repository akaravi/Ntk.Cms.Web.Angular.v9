import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-news-config',
  template: '<router-outlet></router-outlet>',
})
export class NewsConfigComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }
  ngOnInit(): void {
  }
}
