import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit
} from '@angular/core';
//start change title when route happened
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription, filter, map } from 'rxjs';
//end change title when route happened
import { HttpParams } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { CoreAuthService, CoreConfigurationService, CoreSiteService, CoreSiteSupportModel, DeviceTypeEnum, ErrorExceptionResult, OperatingSystemTypeEnum, TokenDeviceClientInfoDtoModel, TokenDeviceSetNotificationIdDtoModel } from 'ntk-cms-api';
import { environment } from 'src/environments/environment';
import { PublicHelper } from './core/helpers/publicHelper';
import { TokenHelper } from './core/helpers/tokenHelper';
import { CmsTranslationService } from './core/i18n/translation.service';
import { ConnectionStatusModel } from './core/models/connectionStatusModel';
import { ProcessModel } from './core/models/processModel';
import { CmsStoreService } from './core/reducers/cmsStore.service';
import { SET_Connection_STATE } from './core/reducers/reducer.factory';
import { CmsSignalrService } from './core/services/cmsSignalr.service';
import { CmsToastrService } from './core/services/cmsToastr.service';
import { PageInfoService } from './core/services/page-info.service';
import { ProcessService } from './core/services/process.service';
import { ThemeService } from './core/services/theme.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private titleService: Title,
    private translate: TranslateService,
    private coreAuthService: CoreAuthService,
    private coreSiteService: CoreSiteService,
    private configService: CoreConfigurationService,
    public themeService: ThemeService,
    public publicHelper: PublicHelper,
    public tokenHelper: TokenHelper,
    private cmsTranslationService: CmsTranslationService,
    private signalrService: CmsSignalrService,
    private swPush: SwPush,
    private cmsToastrService: CmsToastrService,
    private cmsStoreService: CmsStoreService,
    private cdr: ChangeDetectorRef,
    public pageInfo: PageInfoService,
    public processService: ProcessService,
  ) {
    this.themeService.updateInnerSize();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        //do something on start activity
        if (environment.consoleLog)
          console.log('NavigationStart')
        this.themeService.onNavigationStartAppComponent();

      }
      if (event instanceof NavigationError) {
        // Handle error
        console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
        //do something on end activity
        if (environment.consoleLog)
          console.log('NavigationEnd')
        this.themeService.onNavigationEndAppComponent();
      }
    });

    /**signalrService */
    //this.signalrService.startConnection();
    //this.signalrService.addListenerMessage();
    //this.signalrService.addListenerActionLogin();
    //this.signalrService.addListenerActionLogout();
    /**signalrService */
    this.publicHelper.processService.cdr = this.cdr;
    //start change title when route happened
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = environment.mainTitle;
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.translate.get(title).subscribe((str: string) => {
            this.titleService.setTitle(str);
            this.pageInfo.updateTitle(str);
          });

        } //set title that defines in routing's files
      });
    //end change title when route happened
    if (
      environment.cmsServerConfig.configApiServerPath &&
      environment.cmsServerConfig.configApiServerPath.length > 0
    ) {
      this.coreAuthService.setConfig(environment.cmsServerConfig.configApiServerPath);

    }

    this.process$ = processService.processSubject;

  }
title = 'ntk-cms-web';
  constructorInfoAreaId = this.constructor.name;
  process$: Observable<ProcessModel>;
  cmsApiStoreSubscribe: Subscription;
  dataSupportModelResult: ErrorExceptionResult<CoreSiteSupportModel>;
  
  ngOnInit() {
    this.themeService.onInitAppComponentStateOnChange();

    this.cmsApiStoreSubscribe = this.tokenHelper.onInitAppComponentStateOnChange().subscribe({
      next: (state) => {
        //if (state.tokenInfoStore.siteId > 0 && state.tokenInfoStore.userId > 0 && environment.production)
        //  this.getSupport();
        //if (state.tokenInfoStore.userId > 0) {
        //  this.signalrService.login(state.tokenInfoStore.token);
        //} else {
        //  this.signalrService.logout();
        //}
      }
    });

    this.tokenHelper.getTokenInfoStateOnChange().subscribe((state) => {
      if (state.siteId > 0 && state.userId > 0 && environment.production)
        this.getSupport();
      //debugger;
      if (state.userId > 0) {
        this.signalrService.login(state.token);
      } else {
        this.signalrService.logout();
      }
    });
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      const site = httpParams.get('site');
      const siteId = +site;
      if (siteId > 0) {
        localStorage.setItem('siteId', site);
      }
      const siteType = httpParams.get('sitetype');
      const siteTypeId = +siteType;
      if (siteTypeId > 0) {
        localStorage.setItem('siteTypeId', siteType);
      }
      const ResellerSite = httpParams.get('rsite');
      const ResellerSiteId = +ResellerSite;
      if (ResellerSiteId > 0) {
        localStorage.setItem('ResellerSiteId', ResellerSite);
      }
      const ResellerUser = httpParams.get('ruser');
      const ResellerUserId = +ResellerUser;
      if (ResellerUserId > 0) {
        localStorage.setItem('ResellerUserId', ResellerUser);
      }
    }


    this.getDeviceToken();
    this.publicHelper.getEnumRecordStatus();
    // if (this.coreAuthService.deviceToken && this.coreAuthService.deviceToken.length > 0)
    //   this.coreAuthService.ServiceCurrentDeviceToken().subscribe({
    //     next: (ret) => {
    //       if (ret.isSuccess && ret.item.notificationFCMPublicKey.length > 0)
    //         this.subscribeToNotifications(ret.item.notificationFCMPublicKey);
    //     },
    //     error: (er) => {

    //     }
    //   });

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyA3lqa_xiaWGm5rh-IHNQaTt8FN67Y828g",
      authDomain: "ntk-cms.firebaseapp.com",
      databaseURL: "https://ntk-cms.firebaseio.com",
      projectId: "ntk-cms",
      storageBucket: "ntk-cms.appspot.com",
      messagingSenderId: "893852902485",
      appId: "1:893852902485:web:b58b55c1510532e9d2e0dc",
      measurementId: "G-45G43ESXQJ"
    };
    // Initialize Firebase
    if (environment.production) {
      const app = initializeApp(firebaseConfig);
      //todo: karavi
      const analytics = getAnalytics(app);
    }
    this.getServiceVer();
    setTimeout(() => {
      this.themeService.updateMainPagePreloaderShow(false)
    }, 10000)
  }
  ngAfterViewInit(): void {
    this.themeService.afterViewInitAppComponent();

  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.themeService.updateInnerSize();
  }
  getServiceVer(): void {
    const pName = this.constructor.name + 'ServiceIp';

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.configService.ServiceIp().subscribe({
      next: (ret) => {
        this.publicHelper.appServerVersion = ret.appVersion
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeErrorGetOne(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  getDeviceToken(): void {
    const DeviceToken = this.coreAuthService.getDeviceToken();
    if (!DeviceToken || DeviceToken.length === 0) {
      const model: TokenDeviceClientInfoDtoModel = {
        securityKey: environment.cmsTokenConfig.SecurityKey,
        clientMACAddress: '',
        osType: OperatingSystemTypeEnum.none,
        deviceType: DeviceTypeEnum.WebSite,
        packageName: environment.appName,
        appBuildVer: 0,
        appSourceVer: environment.appVersion,
        country: '',
        deviceBrand: '',
        language: this.cmsTranslationService.getSelectedLanguage(),
        locationLat: '',
        locationLong: '',
        simCard: '',
        notificationId: ''
      };
      this.cmsTranslationService.setLanguage(this.cmsTranslationService.getSelectedLanguage());
      this.coreAuthService.ServiceGetTokenDevice(model).subscribe({
        next: (ret) => {
          if (ret.isSuccess && ret.item.notificationFCMPublicKey.length > 0)
            this.subscribeToNotifications(ret.item.notificationFCMPublicKey);
        },
        error: (er) => {

        }
      });
    } else {
      this.coreAuthService.ServiceCurrentDeviceToken().subscribe({
        next: (ret) => {
          if (ret.isSuccess && ret.item.notificationFCMPublicKey.length > 0)
            this.subscribeToNotifications(ret.item.notificationFCMPublicKey);
        },
        error: (er) => {

        }
      });
    }
  }
  subscribeToNotifications(notificationFCMPublicKey) {

    this.swPush.requestSubscription({ serverPublicKey: notificationFCMPublicKey })
      .then(sub => {
        var model = new TokenDeviceSetNotificationIdDtoModel();
        this.pushSubscription = sub;
        model.notificationId = sub.getKey + "",
          model.ClientMACAddress = ''
        this.coreAuthService.ServiceSetTokenDeviceNotificationId(model).subscribe({
          next: (ret) => {

          },
          error: (er) => {

          }
        });
      })
      .catch(err => console.error("Could not subscribe to notifications", err));

  }
  pushSubscription: PushSubscription;
  getSupport() {
    this.coreSiteService.ServiceSupportSite()
      .subscribe({
        next: (ret) => {
          this.dataSupportModelResult = ret;
        },
        error: (er) => {

        }
      }
      );
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event?.key === 'F9') {
      if (localStorage.getItem('KeyboardEventF9'))
        localStorage.removeItem('KeyboardEventF9');
      else localStorage.setItem('KeyboardEventF9', 'F9');
    }
  }
  firstOnonline: boolean = true;
  toastId = 0;
  @HostListener('window:online', ['$event'])
  ononline() {
    var model = new ConnectionStatusModel();
    model.internetConnection = true;
    model.serverConnection = true;
    this.cmsStoreService.setState({ type: SET_Connection_STATE, payload: model });
    if (this.firstOnonline) {
      this.firstOnonline = false;
      return;
    }
    if (this.toastId > 0) {
      this.cmsToastrService.toastr.clear(this.toastId);
    }
    this.cmsToastrService.toastr.success(this.translate.instant('ERRORMESSAGE.TITLE.Youhavesuccessfullyconnectedtotheserver'), this.translate.instant('ERRORMESSAGE.TITLE.Internetaccesswasconnected'));
  }
  @HostListener('window:offline', ['$event'])
  onoffline() {
    var model = new ConnectionStatusModel();
    model.internetConnection = false;
    model.serverConnection = false;
    this.cmsStoreService.setState({ type: SET_Connection_STATE, payload: model });
    this.firstOnonline = false;
    this.toastId = this.cmsToastrService.toastr.error(this.translate.instant('ERRORMESSAGE.TITLE.Pleasecheckyourinternetconnection'), this.translate.instant('ERRORMESSAGE.TITLE.Internetaccesswasinterrupted'), {
      disableTimeOut: true
    }).toastId;

  }

    @HostListener('document:dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
      const element = event.target as HTMLElement;
      // بررسی می‌کنیم که آیا المان یا والدین آن کلاس مورد نظر را دارند
      if (element.closest('.ntk-allow-text-selection')) {
        element.classList.add('ntk-allow-select-text');
        setTimeout(() => {
          element.classList.remove('ntk-allow-select-text');
        }, 5000);
      }
    }

  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

}


