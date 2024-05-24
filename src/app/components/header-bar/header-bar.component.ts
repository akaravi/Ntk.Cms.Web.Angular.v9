import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { IApiCmsServerBase, TokenInfoModel } from 'ntk-cms-api';
import { Observable, Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ContentInfoModel } from 'src/app/core/models/contentInfoModel';
import { PageLinkModel } from 'src/app/core/models/pageLinkModel';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { ThemeModeType, ThemeService } from 'src/app/core/services/theme.service';
import { CmsDataCommentComponent } from 'src/app/shared/cms-data-comment/cms-data-comment.component';
import { CmsDataMemoComponent } from 'src/app/shared/cms-data-memo/cms-data-memo.component';
import { CmsDataPinComponent } from 'src/app/shared/cms-data-pin/cms-data-pin.component';
import { CmsDataTaskComponent } from 'src/app/shared/cms-data-task/cms-data-task.component';
import { CmsShowKeyComponent } from 'src/app/shared/cms-show-key/cms-show-key.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  constructor(
    public tokenHelper: TokenHelper,
    private publicHelper: PublicHelper,
    private themeService: ThemeService,
    private pageInfoService: PageInfoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        //do something on start activity

      }
      if (event instanceof NavigationError) {
        // Handle error
        console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
        //do something on end activity
        this.contentService = null;
      }
    });


    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;

    });
    this.publicHelper.getReducerCmsStoreOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  themeStore = new ThemeStoreModel();
  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLinkModel>>;
  contentService: IApiCmsServerBase;
  contentInfo: ContentInfoModel;

  ngOnInit(): void {
    this.title$ = this.pageInfoService.title.asObservable();
    this.description$ = this.pageInfoService.description.asObservable();
    this.bc$ = this.pageInfoService.breadcrumbs.asObservable();


    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.pageInfoService.contentService.asObservable().subscribe((next) => {
      this.contentService = next;
      this.cdr.detectChanges();
    });
    this.pageInfoService.contentInfo.asObservable().subscribe((next) => {
      this.contentInfo = next;
      this.cdr.detectChanges();
    });
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();

  }
  onActionThemeSwitch(themeMode: ThemeModeType) {
    this.themeService.updateMode(themeMode);
  }
  onActionButtonMemo(): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-wide';
    const dialogRef = this.dialog.open(CmsDataMemoComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.contentService,
        id: this.contentInfo?.id,
        title: this.contentInfo?.title
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonPin(): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-wide';

    const dialogRef = this.dialog.open(CmsDataPinComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.contentService,
        id: this.contentInfo?.id,
        title: this.contentInfo?.title
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonTask(): void {

    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-wide';
    const dialogRef = this.dialog.open(CmsDataTaskComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.contentService,
        id: this.contentInfo?.id,
        title: this.contentInfo?.title
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonComment(): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-wide';
    const dialogRef = this.dialog.open(CmsDataCommentComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.contentService,
        id: this.contentInfo?.id,
        title: this.contentInfo?.title
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonShowKey(): void {
    if (!this.contentInfo || this.contentInfo.id?.length == 0)
      return;
    //open popup

    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CmsShowKeyComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.contentService,
        id: this.contentInfo?.id,
        title: this.contentInfo?.title,
        contentUrl: this.contentInfo?.contentUrl
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
}
