import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoreGuideService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-cms-guide-notice',
  templateUrl: './cms-guide-notice.component.html',
  styleUrls: ["./cms-guide-notice.component.scss"],
})
export class CmsGuideNoticeComponent implements OnInit, OnDestroy {
  static nextId = 0;
  id = ++CmsGuideNoticeComponent.nextId;
  @Input() Identity: number;
  @Input() Key: string;
  @Input() title: string;
  description: string;
  body: string;
  podcast: number;
  podcastSrc: string;
  movie: number;
  movieSrc: string;
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;
  @Input() set optionView(view: boolean) {
    this.privatOptionView = view;
  }
  @Output() optionViewChange = new EventEmitter<boolean>();

  privatOptionView = false;
  constructor(
    private pageInfo: PageInfoService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog,
  ) {

  }
  closeResult = '';
  cmsApiStoreSubscribe: Subscription;
  lang = '';
  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.lang = value.language;
      this.onGetOne();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.lang = ret.language;
        this.onGetOne();
      }
    });

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  bodyShow = false;
  onGetOne(): void {
    if (this.Identity > 0) {
      this.coreGuideService.ServiceGetOneById(this.Identity).subscribe({

        next: (ret) => {
          if (ret.isSuccess) {
            switch (this.lang) {
              case 'fa': {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                this.podcast = ret.item.linkFilePodcastIdFa;
                this.movie = ret.item.linkFileMovieIdFa;
                this.podcastSrc = ret.item.linkFilePodcastIdFaSrc;
                this.movieSrc = ret.item.linkFileMovieIdFaSrc;
                break;
              }
              case 'en': {
                this.title = ret.item.titleEn;
                this.description = ret.item.descriptionEn;
                this.body = ret.item.bodyEn;
                this.podcast = ret.item.linkFilePodcastIdEn;
                this.movie = ret.item.linkFileMovieIdEn;
                this.podcastSrc = ret.item.linkFilePodcastIdEnSrc;
                this.movieSrc = ret.item.linkFileMovieIdEnSrc;
                break;
              }
              case 'ar': {
                this.title = ret.item.titleAr;
                this.description = ret.item.descriptionAr;
                this.body = ret.item.bodyAr;
                this.podcast = ret.item.linkFilePodcastIdAr;
                this.movie = ret.item.linkFileMovieIdAr;
                this.podcastSrc = ret.item.linkFilePodcastIdArSrc;
                this.movieSrc = ret.item.linkFileMovieIdArSrc;
                break;
              }
              case 'de': {
                this.title = ret.item.titleDe;
                this.description = ret.item.descriptionDe;
                this.body = ret.item.bodyDe;
                this.podcast = ret.item.linkFilePodcastIdDe;
                this.movie = ret.item.linkFileMovieIdDe;
                this.podcastSrc = ret.item.linkFilePodcastIdDeSrc;
                this.movieSrc = ret.item.linkFileMovieIdDeSrc;
                break;
              }
              default: {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                this.podcast = ret.item.linkFilePodcastIdFa;
                this.movie = ret.item.linkFileMovieIdFa;
                this.podcastSrc = ret.item.linkFilePodcastIdFaSrc;
                this.movieSrc = ret.item.linkFileMovieIdFaSrc;
                break;
              }

            }
            this.pageInfo.setTitle(this.title);
            this.pageInfo.setDescription(this.description);
          } else if (!environment.production) {
            // console.log(ret.errorMessage, this.Key);
            this.cmsToastrService.typeWarningMessage(ret.errorMessage, this.Key + ' راهنما یافت نشد ');
          }
        },
        error: (err) => {
          this.cmsToastrService.typeError(err);
        }
      });
      //).toPromise();
    } else if (this.Key && this.Key.length > 0) {
      this.coreGuideService.ServiceGetOneByKey(this.Key).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {

            switch (this.lang) {
              case 'fa': {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                this.podcast = ret.item.linkFilePodcastIdFa;
                this.movie = ret.item.linkFileMovieIdFa;
                this.podcastSrc = ret.item.linkFilePodcastIdFaSrc;
                this.movieSrc = ret.item.linkFileMovieIdFaSrc;
                break;
              }
              case 'en': {
                this.title = ret.item.titleEn;
                this.description = ret.item.descriptionEn;
                this.body = ret.item.bodyEn;
                this.podcast = ret.item.linkFilePodcastIdEn;
                this.movie = ret.item.linkFileMovieIdEn;
                this.podcastSrc = ret.item.linkFilePodcastIdEnSrc;
                this.movieSrc = ret.item.linkFileMovieIdEnSrc;
                break;
              }
              case 'ar': {
                this.title = ret.item.titleAr;
                this.description = ret.item.descriptionAr;
                this.body = ret.item.bodyAr;
                this.podcast = ret.item.linkFilePodcastIdAr;
                this.movie = ret.item.linkFileMovieIdAr;
                this.podcastSrc = ret.item.linkFilePodcastIdArSrc;
                this.movieSrc = ret.item.linkFileMovieIdArSrc;
                break;
              }
              case 'de': {
                this.title = ret.item.titleDe;
                this.description = ret.item.descriptionDe;
                this.body = ret.item.bodyDe;
                this.podcast = ret.item.linkFilePodcastIdDe;
                this.movie = ret.item.linkFileMovieIdDe;
                this.podcastSrc = ret.item.linkFilePodcastIdDeSrc;
                this.movieSrc = ret.item.linkFileMovieIdDeSrc;
                break;
              }
              default: {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                this.podcast = ret.item.linkFilePodcastIdFa;
                this.movie = ret.item.linkFileMovieIdFa;
                this.podcastSrc = ret.item.linkFilePodcastIdFaSrc;
                this.movieSrc = ret.item.linkFileMovieIdFaSrc;
                break;
              }
            }
            this.pageInfo.setTitle(this.title);
            this.pageInfo.setDescription(this.description);
          } else if (!environment.production) {
            // console.log(ret.errorMessage, this.Key);
            this.cmsToastrService.typeWarningMessage(ret.errorMessage, this.Key + ' راهنما یافت نشد ');
          }
        },
        error: (err) => {
          this.cmsToastrService.typeError(err);
        }
      });
      //).toPromise();

    }
  }
  onActionCopyHeaderKey(keyTemplate: any, event?: MouseEvent): void {

    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    if (event?.ctrlKey && event?.altKey) {
      const dialogRef = this.dialog.open(keyTemplate, {
        width: '15%',
        panelClass: panelClass,
        enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
        exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
        }
      });
    }
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();

  }
  onActionBottunClick() {
    this.bodyShow = true;
    this.cdr.detectChanges();
  }
  onActionCloseBottunClick() {
    this.bodyShow = false;
    this.cdr.detectChanges();
    this.privatOptionView = false;
    this.optionViewChange.emit(this.privatOptionView);
  }
}
