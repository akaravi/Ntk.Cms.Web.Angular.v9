import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorExceptionResult,
  InfoEnumModel,
} from 'ntk-cms-api';

@Component({
    selector: 'app-cms-enum-x-selectionlist',
    templateUrl: './cms-enum-x-selectionlist.component.html',
    standalone: false
})
export class CmsEnumXSelectionListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsEnumXSelectionListComponent.nextId;
  constructor(
    public translate: TranslateService,) {
  }
  @Input()
  set model(value: number[]) {
    this.onActionSelectForce(value);
  }
  @Output() modelChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  dataModelResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  @Input() optionDisabled = false;
  @Input() optionLabel = '';
  @Input() optionRequired = false;
  @Input()
  set optionDataListResult(vallue: ErrorExceptionResult<InfoEnumModel>) {
    this.dataModelResult = vallue;
    this.dataModelResult.listItems.forEach((el) => this.fieldsStatus.set(el.value, false));
    this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
    this.dataModelResult.listItems.forEach((el) => {
      if (this.fieldsStatus.get(el.value)) {
        this.dataIdsSelect.push(el.value);
      }
    });
  }


  dataIdsSelect: number[] = [];

  formControl = new FormControl();
  fieldsStatus: Map<number, boolean> = new Map<number, boolean>();
  @Input() optionPlaceholder = '';
  @Output() optionSelectAdded = new EventEmitter();
  @Output() optionSelectRemoved = new EventEmitter();
  @Input() optionReload = () => this.onActionButtonReload();

  ngOnInit(): void {

  }

  onActionSelect(value: InfoEnumModel): void {
    if (this.fieldsStatus.get(value.value)) {
      this.fieldsStatus.set(value.value, false);
      this.optionSelectRemoved.emit(value);
      this.dataIdsSelect.splice(this.dataIdsSelect.indexOf(value.value), 1);
    } else {
      this.fieldsStatus.set(value.value, true);
      this.optionSelectAdded.emit(value);
      this.dataIdsSelect.push(value.value);
    }
    this.modelChange.emit(this.dataIdsSelect);
  }

  onActionSelectForce(ids: number[] | InfoEnumModel[]): void {
    if (typeof ids === typeof Array(Number)) {
      ids.forEach(element => {
        if (this.dataIdsSelect.indexOf(element) < 0)
          this.dataIdsSelect.push(element);
      });
    } else if (typeof ids === typeof Array(InfoEnumModel)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element.value);
      });
    }
    this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
  }
  onActionButtonReload(): void {
    // this.dataModelSelect = new ContactContentModel();

  }
}
