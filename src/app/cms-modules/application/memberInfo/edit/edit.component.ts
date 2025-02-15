import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-application-memberinfo-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit() {
  }
}
