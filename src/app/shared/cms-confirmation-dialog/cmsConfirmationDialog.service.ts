import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from './cmsConfirmationDialog.component';

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {

  }

  btnConfirmText: string = 'OK';
  btnCancelText: string = 'Cancel';
  dialogSize: 'sm' | 'lg' = 'sm';

}
@Injectable()
export class CmsConfirmationDialogService {
  constructor(public dialog: MatDialog, public tokenHelper: TokenHelper,
    public translate: TranslateService,

  ) { }
  public confirm(
    title: string,
    message: string,
    btnConfirmText: string = '',
    btnCancelText: string = '',
    dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    const dialogData = new ConfirmDialogModel(title, message);
    dialogData.btnConfirmText = btnConfirmText;
    dialogData.btnCancelText = btnCancelText;
    dialogData.dialogSize = dialogSize;

    if (!dialogData.btnConfirmText || dialogData.btnConfirmText == '' || dialogData.btnConfirmText.length == 0)
      this.translate.get('ACTION.CONFIRM').subscribe((str: string) => { dialogData.btnConfirmText = str; });
    if (!dialogData.btnCancelText || dialogData.btnCancelText == '' || dialogData.btnCancelText.length == 0)
      this.translate.get('ACTION.CANCEL').subscribe((str: string) => { dialogData.btnCancelText = str; });
    //open poup
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: "90%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: dialogData,
    });
    return dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(result => {
        return Promise.resolve(result); // will return a Promise here
      });

    //open poup
  }

}
