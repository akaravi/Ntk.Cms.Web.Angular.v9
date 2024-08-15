import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site',
  template: '<router-outlet></router-outlet>',
})
export class CoreSiteDomainAliasComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
