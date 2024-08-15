
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult, EstatePropertyCompanyFilterModel, EstatePropertyCompanyModel,
  EstatePropertyCompanyService, FilterDataModel, FilterDataModelSearchTypesEnum
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-estate-property-company-selector',
  templateUrl: './selector.component.html',
})
export class EstatePropertyCompanySelectorComponent implements OnInit {
  static nextId = 0;
  id = ++EstatePropertyCompanySelectorComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    public contentService: EstatePropertyCompanyService) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<EstatePropertyCompanyModel> = new ErrorExceptionResult<EstatePropertyCompanyModel>();
  dataModelSelect: EstatePropertyCompanyModel = new EstatePropertyCompanyModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstatePropertyCompanyModel[]>;
  @Input() optionPlaceholder = '';
  @Input() optionLabel = '';
  @Input() optionSelectFirstItem = false;
  @Input() optionDisabled = false;
  @Output() optionChange = new EventEmitter<EstatePropertyCompanyModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: string | EstatePropertyCompanyModel) {
    this.onActionSelectForce(x);
  }



  ngOnInit(): void {
    this.loadOptions();
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
  displayFn(model?: EstatePropertyCompanyModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: EstatePropertyCompanyModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstatePropertyCompanyModel[]> {
    const filterModel = new EstatePropertyCompanyFilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;

    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Contains;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);
    if (text && typeof text === 'string' && text.length > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    return firstValueFrom(this.contentService.ServiceGetAll(filterModel))
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
  onActionSelect(model: EstatePropertyCompanyModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    this.dataModelSelect.linkMainImageIdSrc = '';
    this.dataModelSelect = null;
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }
  push(newvalue: EstatePropertyCompanyModel): Observable<EstatePropertyCompanyModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));
  }
  onActionSelectForce(id: string | EstatePropertyCompanyModel): void {
    if (typeof id === 'string' && id.length > 0) {
      this.contentService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredOptions = this.push(ret.item);
            this.dataModelSelect = ret.item;
            this.formControl.setValue(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof EstatePropertyCompanyModel) {
      this.filteredOptions = this.push((id as EstatePropertyCompanyModel));
      this.dataModelSelect = (id as EstatePropertyCompanyModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }
  onActionButtonReload(): void {
    this.dataModelSelect = new EstatePropertyCompanyModel();
    this.loadOptions();
  }
}
