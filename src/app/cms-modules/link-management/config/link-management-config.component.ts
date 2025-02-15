import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-linkmanagement-config',
  templateUrl: './link-management-config.component.html',
})
export class LinkManagementConfigComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
