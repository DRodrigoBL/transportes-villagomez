import { Component, OnInit, Input } from '@angular/core';
import { Carga, CargaProducto } from '../../business/model/carga.model';

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

  destino: string;
  chofer: string;
  producto: string;
  ayudante: string;
  origen: string;

  constructor() { }

  ngOnInit() {
    this.findViajeDetailsByTruckName();
  }

  findViajeDetailsByTruckName() {
    for (const load of this.viajes.cargasDetalles) {
      if (load.camioneta === this.truckName) {
        this.origen = load.nombreOrigen;
        this.destino = load.nombreDestino;
        this.chofer = load.chofer;
        this.ayudante = load.ayudante;
        this.producto = this.listProductos(load.productos);
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

}
