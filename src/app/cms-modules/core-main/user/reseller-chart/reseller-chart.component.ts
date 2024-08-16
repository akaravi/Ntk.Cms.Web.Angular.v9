
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreUserService, ErrorExceptionResult,
  FilterModel, RessellerChartModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';



@Component({
  selector: 'app-core-user-reseller-chart',
  templateUrl: './reseller-chart.component.html',
  styleUrls: ['./reseller-chart.component.scss'],
})
export class CoreUserResellerChartComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: CoreUserService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));

  }

  dataModelSelect: RessellerChartModel = new RessellerChartModel();
  dataModelResult: ErrorExceptionResult<RessellerChartModel> = new ErrorExceptionResult<RessellerChartModel>();
  filterModel = new FilterModel();


  treeControl = new NestedTreeControl<RessellerChartModel>(node => node.userChilds);

  dataSource = new MatTreeNestedDataSource<RessellerChartModel>();
  @Output() optionChange = new EventEmitter<RessellerChartModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionButtonReload();

  // hasChild = (_: number, node: RessellerChartModel) => false;
  hasChild(_: number, node: RessellerChartModel): boolean {
    // if (node && node.siteChilds && node.siteChilds.length > 0) {
    //   return true;
    // }
    if (node && node.userChilds && node.userChilds.length > 0) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe((value) => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.filterModel.rowPerPage = 200;
    this.filterModel.accessLoad = true;

    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.categoryService.ServiceGetRessellerChart(this.requestLinkUserId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.dataSource.data = [this.dataModelResult.item];
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  onActionSelect(model: RessellerChartModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionButtonReload(): void {
    if (this.dataModelSelect) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new RessellerChartModel();
    this.DataGetAll();
  }
}
