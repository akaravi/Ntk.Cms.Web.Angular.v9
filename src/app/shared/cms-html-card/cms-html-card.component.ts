import { Component, Input, OnInit } from '@angular/core';
import { FormInfoModel } from 'ntk-cms-api';

@Component({
  selector: 'app-cms-html-card',
  templateUrl: './cms-html-card.component.html',
})
export class CmsHtmlCardComponent implements OnInit {
  static nextId = 0;
  id = ++CmsHtmlCardComponent.nextId;
  @Input()
  public set optionFormInfo(v: FormInfoModel) {
    this.formInfo = v;
  }
  formInfo = new FormInfoModel();
  constructor() { }
  ngOnInit(): void {

  }

}
