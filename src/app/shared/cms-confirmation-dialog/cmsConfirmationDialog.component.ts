import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogModel } from './cmsConfirmationDialog.service';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './cmsConfirmationDialog.component.html',
})
export class ConfirmationDialogComponent implements OnInit {
  static nextId = 0;
  id = ++ConfirmationDialogComponent.nextId;
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  //constructor(private activeModal: NgbActiveModal) { }
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) { }
  ngOnInit(): void {
  }

  public onDismiss(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }


}
