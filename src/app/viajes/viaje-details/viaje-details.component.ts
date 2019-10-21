import { Component, OnInit, Input } from '@angular/core';
import { Carga, CargaProducto, CargasDetalles } from '../../business/model/carga.model';
import {
  MatSlideToggleChange,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/dialog/confirmation.dialog';
import { ViajesService } from '../../shared/services/viajes.service';

@Component({
  selector: 'app-viaje-details',
  templateUrl: './viaje-details.component.html',
  styleUrls: ['./viaje-details.component.css']
})
export class ViajeDetailsComponent implements OnInit {
  @Input()
  truckName: string;

  @Input()
  viajes: Carga;

  viajesTerminados: boolean[] = [false];

  viajesDetallesToDisplay: CargasDetalles[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private viajesService: ViajesService
  ) {}

  ngOnInit() {
    this.findViajeDetailsByTruckName();
  }

  findViajeDetailsByTruckName() {
    for (const viaje of this.viajes.cargasDetalles) {
      if (viaje.camioneta === this.truckName) {
        this.viajesDetallesToDisplay.push(viaje);
      }
    }
  }

  listProductos(productos: CargaProducto[]): string {
    let productosStr = '';
    for (const prod of productos) {
      productosStr = prod.nombreProducto + ', ';
    }
    return productosStr.substr(0, productosStr.length - 2);
  }

  isViajeTerminadoChange(event: MatSlideToggleChange, viaje: CargasDetalles) {
    if (event.checked) {
      this.openDialog(viaje, event);
    }
  }

  openDialog(viaje: CargasDetalles, event: MatSlideToggleChange) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: '¿Estas seguro que deseas terminar el viaje?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });
    const snack = this.snackBar;

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        event.source.disabled = true;
        viaje.isViajeTerminado = true;
        this.terminarViaje(viaje);
        this.snackBar.open('Viaje terminado con éxito', 'Ok', {
          duration: 4000
        });
      } else {
        event.source.checked = false;
      }
    });
  }
  terminarViaje(viaje: CargasDetalles) {
    console.log('Actualizar viaje a terminado y liberar camioneta');
    this.viajesService.terminarViaje({
      fechaCarga: this.viajes.fechaCarga,
      fechaServicio: this.viajes.fechaServicio,
      cargasDetalles: [viaje]
    });
  }
}
