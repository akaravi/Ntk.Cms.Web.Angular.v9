import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-site-domainalias',
  template: '<router-outlet></router-outlet>',
  standalone: false
})
export class CoreSiteDomainAliasComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
