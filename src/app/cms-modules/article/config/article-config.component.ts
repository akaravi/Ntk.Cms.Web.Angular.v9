import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-article-config',
  template: '<router-outlet></router-outlet>',
})
export class ArticleConfigComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }
  ngOnInit(): void {
  }
}
