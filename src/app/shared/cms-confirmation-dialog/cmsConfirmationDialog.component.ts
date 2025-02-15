import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogModel } from './cmsConfirmationDialog.service';


@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './cmsConfirmationDialog.component.html',
    standalone: false
})
export class ConfirmationDialogComponent implements OnInit {
  static nextId = 0;
  id = ++ConfirmationDialogComponent.nextId;


  //constructor(private activeModal: NgbActiveModal) { }
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    if (!data)
      this.dialogRef.close(false);

  }
  ngOnInit(): void {
  }

  public onDismiss(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }


}
