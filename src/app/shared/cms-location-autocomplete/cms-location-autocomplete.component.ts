import { ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreLocationModel,
  CoreLocationService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
class chipModel {
  display: string;
  value: number;
}
@Component({
    selector: 'app-cms-location-autocomplete',
    templateUrl: './cms-location-autocomplete.component.html',
    standalone: false
})
export class CmsLocationCompleteComponent implements OnInit {
  static nextId = 0;
  id = ++CmsLocationCompleteComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public service: CoreLocationService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.filteredOptions = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      debounceTime(400),
      switchMap(val => {
        return this.filter(val || '')
      })
    );
  }
  @Input() optionDisabled = false;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @Input() optionPlaceholder = '+ Tag';
  @Input() optionLabel = "";
  @Input() optionCssClassInputText = "";
  @Input() optionCssClassSelectOption = "";
  @Output() optionChange = new EventEmitter<number[]>();
  @Input() set optionSelectForce(x: number[]) {
    this.onActionSelectForce(x);
  }




  tagDataModel: chipModel[] = [];
  tagLastDataModel: chipModel[] = [];
  selectForceStatus = true;
  separatorKeysCodes: number[] = [ENTER];
  tagCtrl = new FormControl('');
  filteredOptions: Observable<chipModel[]>;
  addOnBlur = true;
  ngOnInit(): void {
    if (!this.optionLabel || this.optionLabel.length == 0 && this.optionPlaceholder?.length > 0)
      this.optionLabel = this.optionPlaceholder;
  }

  displayOption(model?: CoreLocationModel): string | undefined {
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0
      && model.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.title.length > 0
      && model.virtual_Parent.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0 && model.virtual_Parent.virtual_Parent && model.virtual_Parent.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.virtual_Parent.titleML + ' > ' + model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    if (model && model.virtual_Parent && model.virtual_Parent.title.length > 0) {
      return model.virtual_Parent.titleML + ' > ' + model.titleML;
    }
    return model ? (model.titleML) : undefined;
  }
  // filter and return the values
  filter(text: string): Observable<chipModel[]> {

    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    /*Filters */
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Contains;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);
    /*Filters */
    filter = new FilterDataModel();
    filter.propertyName = 'TitleResourceLanguage';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Contains;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);
    /*Filters */
    filter = new FilterDataModel();
    filter.propertyName = 'Id';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Equal;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);



    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });


    return this.service.ServiceGetAll(filterModel).pipe(
      map((data) => {
        this.tagLastDataModel = data.listItems.map(val => ({
          display: this.displayOption(val)//val.titleML
          , value: val.id
        }));
        this.publicHelper.processService.processStop(pName);
        return this.tagLastDataModel;
      })
    );

  }

  checkIndex(val: number): number {
    var index = 0;
    var ret = -1;
    this.tagDataModel.forEach(element => {
      if (element.value == val) {
        ret = index;
      }
      index++;
    });
    return ret;
  }
  add(event: MatChipInputEvent): void {
    // Add our item
    var val: chipModel;
    if (event.value) {
      this.tagLastDataModel.forEach(element => {
        if ((element.display == event.value || element.value + "" == event.value)) {
          val = element;
        }
      });
    }
    if (val && this.checkIndex(val.value) < 0) {
      this.tagDataModel.push(val);
      this.onActionChange();
    }
    // Clear the input value
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(item: chipModel): void {
    const index = this.checkIndex(item.value);
    if (index >= 0) {
      this.tagDataModel.splice(index, 1);
      this.onActionChange();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const val = event.option.value as unknown as chipModel;
    if (this.checkIndex(val.value) < 0) {
      this.tagDataModel.push(val);
    }
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.onActionChange();
  }


  onActionChange(): void {
    const retIds = [];
    this.tagDataModel.forEach(x => {
      if (retIds.findIndex(y => y == x.value) < 0)
        retIds.push(x.value);
    });
    this.selectForceStatus = false;
    this.optionChange.emit(retIds);
  }

  onActionSelectForce(ids: number[]): void {
    if (!this.selectForceStatus) {
      return;
    }
    if (!ids || ids.length === 0) {
      return;
    }

    const filterModel = new FilterModel();
    ids.forEach(item => {
      if (item > 0) {
        const filter = new FilterDataModel();
        filter.propertyName = 'Id';
        filter.value = item;
        filter.clauseType = ClauseTypeEnum.Or;
        filterModel.filters.push(filter);
      }
    });

    this.service.ServiceGetAll(filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          ret.listItems.forEach(val => {
            if (this.tagDataModel.findIndex(y => y.value == val.id) < 0)
              this.tagDataModel.push({
                value: val.id,
                display: this.displayOption(val) //val.titleML
              });
          });
        } else {
          this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
        }
        return;
      },
      error: (err) => {
        this.cmsToastrService.typeErrorGetAll(err);
      }
    });
  }



}
