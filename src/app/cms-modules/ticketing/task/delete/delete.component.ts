import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticketing-task-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit() {
  }

}
