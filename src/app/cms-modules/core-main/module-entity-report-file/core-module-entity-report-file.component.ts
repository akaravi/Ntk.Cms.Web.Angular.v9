import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-module-entity-report-file',
  template: '<router-outlet></router-outlet>',
})
export class CoreModuleEntityReportFileComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
