import { Component, OnInit, Input } from '@angular/core';
import { Carga, CargaProducto } from '../../business/model/carga.model';
import { MatSlideToggleChange, MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/dialog/confirmation.dialog';

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

  isViajeTerminado: boolean;
  destino: string;
  chofer: string;
  producto: string;
  ayudante: string;
  origen: string;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.findViajeDetailsByTruckName();
  }

  findViajeDetailsByTruckName() {
    for (const viaje of this.viajes.cargasDetalles) {
      if (viaje.camioneta === this.truckName) {
        this.origen = viaje.nombreOrigen;
        this.destino = viaje.nombreDestino;
        this.chofer = viaje.chofer;
        this.ayudante = viaje.ayudante;
        this.producto = this.listProductos(viaje.productos);
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

  isViajeTerminadoChange(event: MatSlideToggleChange) {
    this.isViajeTerminado = event.checked;
    if (this.isViajeTerminado) {
      this.openDialog(0);
    }
  }

  openDialog(viajeIndex: number) {
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
        this.terminarViaje(viajeIndex);
        console.log('Actualizar viaje a terminado y liberar camioneta');
        this.snackBar.open('Viaje terminado con éxito', 'Ok', {
          duration: 2000
        });
      } else {
        this.isViajeTerminado = false;
      }
    });
  }
  terminarViaje(viajeIndex: number) {
    this.isViajeTerminado = true;
    console.log('Viaje index: ' + viajeIndex);
    console.log('Actualizar viaje a terminado y liberar camioneta');
    // throw new Error('Method not implemented.');
  }
}
