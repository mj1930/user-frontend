import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private matSnackbar: MatSnackBar) {}

  openSnackbar(msg: string) {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';

    this.matSnackbar.open(msg, 'End Now', {
      duration: 1000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition
    });
  }
}
