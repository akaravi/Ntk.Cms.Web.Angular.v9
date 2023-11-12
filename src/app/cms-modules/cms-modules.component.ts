import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit,
  ViewChild
} from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
// import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
// import { environment } from 'src/environments/environment';
// import { CmsModulesInitService } from './core/cms-modules-init.service';
// import { CmsModulesService } from './core/cms-modules.service';

@Component({
  selector: 'app-cms-modules',
  templateUrl: './cms-modules.component.html',
  styleUrls: ['./cms-modules.component.scss'],
})
export class CmsModulesComponent implements OnInit, AfterViewInit {
  // Public variables
  // selfCmsModules = 'default';
  // asideSelfDisplay: true;
  // asideMenuStatic: true;
  // contentClasses = '';
  // contentContainerClasses = '';
  // toolbarDisplay = true;
  // contentExtended: false;
  // asideCSSClasses: string;
  // asideHTMLAttributes: any = {};
  // headerMobileClasses = '';
  // headerMobileAttributes = {};
  // footerDisplay: boolean;
  // footerCSSClasses: string;
  // headerCSSClasses: string;
  // headerHTMLAttributes: any = {};
  // // offcanvases
  // extrasSearchOffcanvasDisplay = false;
  // extrasNotificationsOffcanvasDisplay = false;
  // extrasQuickActionsOffcanvasDisplay = false;
  // extrasCartOffcanvasDisplay = false;
  // extrasUserOffcanvasDisplay = false;
  // extrasQuickPanelDisplay = false;
  // extrasScrollTopDisplay = false;
  // asideDisplay: boolean;
  // @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  // @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  // @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  constructor(
    // private initService: CmsModulesInitService,
    // private cms-modules: CmsModulesService,
    // public tokenHelper: TokenHelper,
    // private cdr: ChangeDetectorRef,
  ) {

    //this.initService.init();
  }
  // tokenInfo = new TokenInfoModel();
  // cmsApiStoreSubscribe: Subscription;

  // loadDemoTheme = environment.loadDemoTheme;
  ngOnInit(): void {
    // this.tokenHelper.getCurrentToken().then((value) => {
    //   this.tokenInfo = value;
    //   document.body.classList.replace('aside-fixed-ltr', 'aside-fixed-' + this.tokenInfo.direction);
    //   document.body.classList.replace('aside-fixed-rtl', 'aside-fixed-' + this.tokenInfo.direction);
    //   this.cdr.detectChanges();
    // });
    // this.cmsApiStoreSubscribe = this.tokenHelper
    //   .getCurrentTokenOnChange()
    //   .subscribe((next) => {
    //     this.tokenInfo = next;
    //     document.body.classList.replace('aside-fixed-ltr', 'aside-fixed-' + this.tokenInfo.direction);
    //     document.body.classList.replace('aside-fixed-rtl', 'aside-fixed-' + this.tokenInfo.direction);
    //     this.cdr.detectChanges();
    //   });
    // // build view by cms-modules config settings
    // this.asideDisplay = this.cms-modules.getProp('aside.display') as boolean;
    // this.toolbarDisplay = this.cms-modules.getProp('toolbar.display') as boolean;
    // this.contentContainerClasses = this.cms-modules.getStringCSSClasses('contentContainer');
    // this.asideCSSClasses = this.cms-modules.getStringCSSClasses('aside');
    // this.headerCSSClasses = this.cms-modules.getStringCSSClasses('header');
    // this.headerHTMLAttributes = this.cms-modules.getHTMLAttributes('headerMenu');
  }

  ngAfterViewInit(): void {
    // if (this.ktHeader) {
    //   for (const key in this.headerHTMLAttributes) {
    //     if (this.headerHTMLAttributes.hasOwnProperty(key)) {
    //       this.ktHeader.nativeElement.attributes[key] =
    //         this.headerHTMLAttributes[key];
    //     }
    //   }
    // }
  }
  ngOnDestroy(): void {
    //  this.cmsApiStoreSubscribe.unsubscribe();
  }
}
