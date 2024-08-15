import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-article',
  template: '<router-outlet></router-outlet>',
})
export class ArticleComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }
  ngOnInit(): void {
  }
}
