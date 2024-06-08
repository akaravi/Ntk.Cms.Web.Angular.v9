import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './cmsConfirmationDialog.component';

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {

  }

  btnOkText: string = 'OK';
  btnCancelText: string = 'Cancel';
  dialogSize: 'sm' | 'lg' = 'sm';

}
@Injectable()
export class CmsConfirmationDialogService {
  constructor(public dialog: MatDialog) { }
  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {

    const dialogData = new ConfirmDialogModel(title, message);
    dialogData.btnOkText = btnOkText;
    dialogData.btnCancelText = btnCancelText;
    dialogData.dialogSize = dialogSize;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    return dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(result => {
        return Promise.resolve(result); // will return a Promise here
      });
  }

}
