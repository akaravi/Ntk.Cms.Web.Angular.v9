import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, PageAbilityTypeEnum, WebDesignerMainPageModel,
  WebDesignerMainPageService
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
@Component({
    selector: 'app-webdesigner-page-selector',
    templateUrl: './selector.component.html',
    standalone: false
})
export class WebDesignerMainPageSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++WebDesignerMainPageSelectorComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public categoryService: WebDesignerMainPageService) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() set optionMasterTemplateId(x: string) {
    this.masterTemplateId = x;
    this.loadOptions();
  }
  @Input() set optionSelectForce(x: string | WebDesignerMainPageModel) {
    this.onActionSelectForce(x);
  }
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageModel> = new ErrorExceptionResult<WebDesignerMainPageModel>();
  dataModelSelect: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  formControl = new FormControl();
  filteredOptions: Observable<WebDesignerMainPageModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionMasterPage = false;
  @Input() optionLabel = '';
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<WebDesignerMainPageModel>();
  masterTemplateId = '';
  @Input() optionReload = () => this.onActionButtonReload();



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
  displayFn(model?: WebDesignerMainPageModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  displayOption(model?: WebDesignerMainPageModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<WebDesignerMainPageModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;

    let filter = new FilterDataModel();
    const filterChild = new FilterDataModel();
    if (text && text.length > 0) {
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterChild.filters.push(filter);
    }
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterChild.filters.push(filter);
    }
    filterModel.filters.push(filterChild);
    if (this.optionMasterPage) {
      filter = new FilterDataModel();
      filter.propertyName = 'PageAbilityType';
      filter.value = PageAbilityTypeEnum.Master;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.And;
      filterModel.filters.push(filter);
    }
    if (this.masterTemplateId && this.masterTemplateId.length > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'LinkPageTemplateGuId';
      filter.value = this.masterTemplateId;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.And;
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
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id.length <= 0) &&
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
  onActionSelect(model: WebDesignerMainPageModel): void {
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
  push(newvalue: WebDesignerMainPageModel): Observable<WebDesignerMainPageModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));
  }
  onActionSelectForce(id: string | WebDesignerMainPageModel): void {
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
    if (typeof id === typeof WebDesignerMainPageModel) {
      this.filteredOptions = this.push((id as WebDesignerMainPageModel));
      this.dataModelSelect = (id as WebDesignerMainPageModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }
  onActionButtonReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new WebDesignerMainPageModel();
    // this.optionsData.Select = new WebDesignerMainPageModel();
    this.loadOptions();
  }
}
