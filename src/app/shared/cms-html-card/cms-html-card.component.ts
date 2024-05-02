import { Component, Input, OnInit } from '@angular/core';
import { FormInfoModel } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

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

  @Input()
  public set optionLoading(v: ProgressSpinnerModel) {
    this.loading = v;
  }
  loading = new ProgressSpinnerModel();
  constructor() { }
  ngOnInit(): void {

  }

}
