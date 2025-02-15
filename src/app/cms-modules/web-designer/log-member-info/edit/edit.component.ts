import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-webdesigner-logmemberinfo-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit() {
  }
}
