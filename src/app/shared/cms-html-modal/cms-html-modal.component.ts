import { Component, Input, OnInit } from '@angular/core';
import { FormInfoModel } from 'ntk-cms-api';

@Component({
    selector: 'app-cms-html-modal',
    templateUrl: './cms-html-modal.component.html',
    standalone: false
})
export class CmsHtmlModalComponent implements OnInit {
  static nextId = 0;
  id = ++CmsHtmlModalComponent.nextId;
  @Input()
  public set optionFormInfo(v: FormInfoModel) {
    this.formInfo = v;
  }
  formInfo = new FormInfoModel();

  constructor() { }
  ngOnInit(): void {

  }
 
}
