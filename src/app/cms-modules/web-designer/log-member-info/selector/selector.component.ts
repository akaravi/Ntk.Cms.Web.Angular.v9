
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel,
  WebDesignerLogMemberInfoModel,
  WebDesignerLogMemberInfoService
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
@Component({
    selector: 'app-webdesigner-logmemberinfo-selector',
    templateUrl: './selector.component.html',
    standalone: false
})
export class WebDesignerLogMemberInfoSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++WebDesignerLogMemberInfoSelectorComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public categoryService: WebDesignerLogMemberInfoService) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<WebDesignerLogMemberInfoModel> = new ErrorExceptionResult<WebDesignerLogMemberInfoModel>();
  dataModelSelect: WebDesignerLogMemberInfoModel = new WebDesignerLogMemberInfoModel();
  formControl = new FormControl();
  filteredOptions: Observable<WebDesignerLogMemberInfoModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Input() optionLabel = '';
  @Output() optionChange = new EventEmitter<WebDesignerLogMemberInfoModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: string | WebDesignerLogMemberInfoModel) {
    this.onActionSelectForce(x);
  }



  ngOnInit(): void {
    this.loadOptions();
    if (!this.optionLabel || this.optionLabel.length == 0 && this.optionPlaceholder?.length > 0)
      this.optionLabel = this.optionPlaceholder;
  }
  loadOptions(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1500),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return this.DataGetAll(val || '');
          }
          return [];
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }
  displayFn(model?: WebDesignerLogMemberInfoModel): string | undefined {
    return model ? model.deviceId : undefined;
  }
  displayOption(model?: WebDesignerLogMemberInfoModel): string | undefined {
    return model ? model.deviceId : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<WebDesignerLogMemberInfoModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;

    if (text && typeof text === 'string' && text.length > 0) {
      /*filter*/
      let filter = new FilterDataModel();
      filter.propertyName = 'DeviceBrand';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filterModel.filters.push(filter);
      /*filter*/
      filter = new FilterDataModel();
      filter.propertyName = 'NotificationId';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
      /*filter*/
      filter = new FilterDataModel();
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
      /*filter*/
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }
    if (text && typeof +text === 'number' && +text > 0) {
      let filter = new FilterDataModel();
      filter = new FilterDataModel();
      filter.propertyName = 'LinkUserId';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
      /*filter*/
      filter = new FilterDataModel();
      filter.propertyName = 'LinkMemberId';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    return await firstValueFrom(this.categoryService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect?.id?.length === 0) &&
            this.dataModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.listItems[0]); }, 1000);
            this.onActionSelect(this.dataModelResult.listItems[0]);
          }
          /*select First Item */
          this.publicHelper.processService.processStop(pName);
          return response.listItems;
        });
  }
  onActionSelect(model: WebDesignerLogMemberInfoModel): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = null;
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }
  push(newvalue: WebDesignerLogMemberInfoModel): Observable<WebDesignerLogMemberInfoModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | WebDesignerLogMemberInfoModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.id === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.id === id)) {
        const item = this.dataModelResult.listItems.find(x => x.id === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      this.categoryService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredOptions = this.push(ret.item);
            this.dataModelSelect = ret.item;
            this.formControl.setValue(ret.item);
            this.optionChange.emit(ret.item);
          }
        }
      });
      return;
    }
    if (typeof id === typeof WebDesignerLogMemberInfoModel) {
      this.filteredOptions = this.push((id as WebDesignerLogMemberInfoModel));
      this.dataModelSelect = (id as WebDesignerLogMemberInfoModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }
  onActionButtonReload(): void {
    this.dataModelSelect = new WebDesignerLogMemberInfoModel();
    this.loadOptions();
  }
}
