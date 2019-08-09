import { Component, OnInit, Input } from '@angular/core';
import { Load } from '../../model/load.model';

@Component({
  selector: 'app-carga-details',
  templateUrl: './carga-details.component.html',
  styleUrls: ['./carga-details.component.css']
})
export class CargaDetailsComponent implements OnInit {

  @Input()
  truckName: string;

  @Input()
  cargasList: Load[];

  destino: string;
  chofer: string;
  producto: string;

  constructor() { }

  ngOnInit() {

    console.log('truckName> ' + JSON.stringify(this.truckName));
    console.log('cargasList> ' + JSON.stringify(this.cargasList));
    this.findCargaDetailsByTruckName();
  }

  findCargaDetailsByTruckName() {
    for (const load of this.cargasList) {
      console.log('load.camioneta: ' + load.camioneta + '===' + 'truckName');
      if (load.camioneta === this.truckName) {
        this.destino = load.destino;
        this.chofer = load.chofer;
        this.producto = load.producto;
      }
    }
  }

}
