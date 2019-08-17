import { Component, OnInit, Input } from '@angular/core';
import { Carga, CargaProducto } from '../../model/carga.model';

@Component({
  selector: 'app-carga-details',
  templateUrl: './carga-details.component.html',
  styleUrls: ['./carga-details.component.css']
})
export class CargaDetailsComponent implements OnInit {

  @Input()
  truckName: string;

  @Input()
  cargas: Carga;

  destino: string;
  chofer: string;
  producto: string;
  ayudante: string;
  origen: string;

  constructor() { }

  ngOnInit() {
    // console.log('truckName> ' + JSON.stringify(this.truckName));
    // console.log('cargasList> ' + JSON.stringify(this.cargas));
    this.findCargaDetailsByTruckName();
  }

  findCargaDetailsByTruckName() {
    for (const load of this.cargas.cargasDetalles) {
      // console.log('load.camioneta: ' + load.camioneta + '===' + 'truckName');
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
