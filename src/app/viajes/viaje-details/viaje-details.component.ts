import { Component, OnInit, Input } from '@angular/core';
import {
  Carga,
  CargaProducto,
  CargasDetalles
} from '../../business/model/carga.model';
import {
  MatSlideToggleChange,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/dialog/confirmation.dialog';
import { ViajesService } from '../../shared/services/viajes.service';
import { ViewProductosDialogComponent } from '../../shared/dialog-view-products/view.products.dialog';
import { DateUtilsService } from '../../shared/services/date.utils.service';
import { Truck } from '../../business/model/truck.model';

@Component({
  selector: 'app-viaje-details',
  templateUrl: './viaje-details.component.html',
  styleUrls: ['./viaje-details.component.css']
})
export class ViajeDetailsComponent implements OnInit {
  @Input()
  camioneta: Truck;

  @Input()
  viajes: Carga;

  viajesDetallesToDisplay: CargasDetalles[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private viajesService: ViajesService,
    private dateUtilsService: DateUtilsService
  ) {}

  ngOnInit() {
    this.findViajeDetailsByTruckName();
  }

  findViajeDetailsByTruckName() {
    for (const viaje of this.viajes.cargasDetalles) {
      if (viaje.camioneta === this.camioneta.name) {
        this.viajesDetallesToDisplay.push(viaje);
      }
    }
  }

  orderedViajesDetallesToDisplay(): CargasDetalles[] {
    return this.viajesDetallesToDisplay.sort((a, b) =>
      a.viajeIndex > b.viajeIndex ? 1 : -1
    );
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

  verProductos(viaje: CargasDetalles) {
    const dialogRef = this.dialog.open(ViewProductosDialogComponent, {
      data: {
        message: '¿Estas seguro que deseas terminar el viaje?',
        viajeDetalles: viaje,
        buttonText: {
          ok: 'Aceptar'
        }
      }
    });
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

  formatDate(): string {
    return this.viajes.fechaServicio;
  }

  isCamionetaFree(): boolean {
    const orderedViajesDetalles = this.orderedViajesDetallesToDisplay();
    return !orderedViajesDetalles[orderedViajesDetalles.length - 1].isViajeTerminado;
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
