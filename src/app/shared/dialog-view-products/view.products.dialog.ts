import { Component, Inject, Input } from '@angular/core';
import { CargasDetalles } from '../../business/model/carga.model';
import {
  VERSION,
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from '@angular/material';

@Component({
  selector: 'app-view-products-dialog',
  templateUrl: './view.products.dialog.html',
  styleUrls: ['./view.products.dialog.css']
})
export class ViewProductosDialogComponent {

  viajeDetalles: CargasDetalles;

  message = 'Productos';
  confirmButtonText = 'Aceptar';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ViewProductosDialogComponent>
  ) {
    if (data) {
      this.message = data.message || this.message;
      if (data.viajeDetalles) {
        this.viajeDetalles = data.viajeDetalles;
      }
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      }
    }
  }

  calculateTotalUnidades(): number {
    let sumUnidades = 0;
    for (const prod of this.viajeDetalles.productos) {
      sumUnidades += prod.cantidad * prod.unidadesPorMedida;
    }
    return sumUnidades;
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
