import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit() {
  }
}
