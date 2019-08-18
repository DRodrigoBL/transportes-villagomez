import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadsService } from '../../services/loads.service';

import { Carga, CargasDetalles, CargaProducto } from '../../model/carga.model';

@Component({
  selector: 'app-carga-vermas',
  templateUrl: './carga-vermas.component.html',
  styleUrls: ['./carga-vermas.component.css']
})
export class CargaVermasComponent implements OnInit {
  // router params
  fechaServicio: string;
  camioneta: string;
  chofer: string;

  constructor(
    private route: ActivatedRoute,
    private cargasService: LoadsService,
    private router: Router
  ) {}

  cargaFetchedFromService: Carga;
  cargaToView: Carga;
  cargaDetallesToView: CargasDetalles;


  ngOnInit() {
    this.configureRouterParamsSubs();
    this.configureLoadsSubscription();
  }

  configureRouterParamsSubs() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.fechaServicio = queryParams.get('fechaCarga');
      this.camioneta = queryParams.get('camioneta');
      this.chofer = queryParams.get('chofer');
      this.cargasService.findCargasByDateStr(this.fechaServicio);
    });
  }

  configureLoadsSubscription() {
    this.cargasService.cargasByDateLoaded.subscribe((loadedCargas: Carga) => {
      this.cargaFetchedFromService = loadedCargas;
      if (!this.cargaFetchedFromService) {
        console.log('no hay cargas');
      }
      this.cargaToView = this.findCargaToView();
      this.cargaDetallesToView = this.cargaToView.cargasDetalles[0];
    });
  }

  calculateTotalUnidades(): number {
    let sumUnidades = 0;
    for (const prod of this.cargaDetallesToView.productos) {
      sumUnidades += prod.cantidad * prod.unidadesPorMedida;
    }
    return sumUnidades;
  }

  findCargaToView(): Carga {
    for (const carga of this.cargaFetchedFromService.cargasDetalles) {
      if (carga.camioneta === this.camioneta) {
        return {
          fechaCarga: this.fechaServicio,
          cargasDetalles: [carga]
        };
      }
    }
    return null;
  }
}
