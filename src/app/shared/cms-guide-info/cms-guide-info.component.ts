import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { CoreGuideService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-guide-info',
  templateUrl: './cms-guide-info.component.html',
})
export class CmsGuideinfoComponent implements OnInit, OnDestroy {
  static nextId = 0;
  id = ++CmsGuideinfoComponent.nextId;
  @Input() Identity: number;
  @Input() Key: string;
  @Input() title: string;
  description: string;
  body: string;
  @Input() btnOkText: string;
  show = true;
  constructor(
    private tokenHelper: TokenHelper,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
  ) { }
  closeResult = '';
  cmsApiStoreSubscribe: Subscription;
  lang = '';
  ngOnInit(): void {

    this.tokenHelper.getCurrentToken().then((value) => {
      this.lang = value.language;

    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.lang = ret.language;
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionGuideClick(content): void {
    if (this.Identity > 0) {
      this.coreGuideService.ServiceGetOneById(this.Identity).subscribe({

        next: (ret) => {
          if (ret.isSuccess) {
            switch (this.lang) {
              case 'fa': {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                break;
              }
              case 'en': {
                this.title = ret.item.titleEn;
                this.description = ret.item.descriptionEn;
                this.body = ret.item.bodyEn;
                break;
              }
              case 'ar': {
                this.title = ret.item.titleAr;
                this.description = ret.item.descriptionAr;
                this.body = ret.item.bodyAr;
                break;
              }
              case 'de': {
                this.title = ret.item.titleDe;
                this.description = ret.item.descriptionDe;
                this.body = ret.item.bodyDe;
                break;
              }
              default: {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                break;
              }
            }
            this.openModal(content);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        },
        error: (err) => {
          this.cmsToastrService.typeError(err);
        }
      });

    } else if (this.Key && this.Key.length > 0) {
      this.coreGuideService.ServiceGetOneByKey(this.Key).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            switch (this.lang) {
              case 'fa': {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                break;
              }
              case 'en': {
                this.title = ret.item.titleEn;
                this.description = ret.item.descriptionEn;
                this.body = ret.item.bodyEn;
                break;
              }
              case 'ar': {
                this.title = ret.item.titleAr;
                this.description = ret.item.descriptionAr;
                this.body = ret.item.bodyAr;
                break;
              }
              case 'de': {
                this.title = ret.item.titleDe;
                this.description = ret.item.descriptionDe;
                this.body = ret.item.bodyDe;
                break;
              }
              default: {
                this.title = ret.item.titleFa;
                this.description = ret.item.descriptionFa;
                this.body = ret.item.bodyFa;
                break;
              }
            }
            this.openModal(content);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        },
        error: (err) => {
          this.cmsToastrService.typeError(err);
        }
      });


    } else if (this.description && this.description.length > 0) {
      this.openModal(content);
    }
  }
  openModal(content): void {
    //karavi error on angular 18//
    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
  private getDismissReason(reason: any): string {
    //karavi error on angular 18//
    // if (reason === ModalDismissReasons.ESC) {
    //   return 'by pressing ESC';
    // } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //   return 'by clicking on a backdrop';
    // } else {
    //   return `with: ${reason}`;
    // }
    return "";
  }

}
