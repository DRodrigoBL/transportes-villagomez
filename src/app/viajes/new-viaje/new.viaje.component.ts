import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {} from '@angular/fire';
import { Observable } from 'rxjs';

import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormArray
} from '@angular/forms';
import { Origen, Destino, Producto } from '../../business/model/origen.model';
import { LoadsService } from '../../business/services/loads.service';
import {
  Carga,
  CargasDetalles,
  CargaProducto
} from '../../business/model/carga.model';
import { DateUtilsService } from '../../shared/services/date.utils.service';
import { ViajesService } from '../../shared/services/viajes.service';

@Component({
  selector: 'app-new.viaje',
  templateUrl: './new.viaje.component.html',
  styleUrls: ['./new.viaje.component.css']
})
export class NewViajeComponent implements OnInit {
  // router params
  fechaServicioView: string;
  camioneta: string;
  chofer: string;

  constructor(
    private formBuilder: FormBuilder,
    private viajesService: ViajesService,
    private cargasService: LoadsService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtilsService: DateUtilsService
  ) {}

  // form objects
  cargasForm: FormGroup;

  // dynamic form values
  origenOptions: Origen[] = [];
  currentOrigen: Origen;
  currentDestino: Destino;
  productosSeleccionados: Producto[] = [];
  ayudantes = [
    'DAMIAN ANDRADE GRANILLO',
    'LUIS MANUEL MORALES VELAZQUEZ',
    'RAUL SANCHEZ MORENO',
    'PEDRO ADRIAN VAZQUEZ'
  ];

  // form values to be saved
  cargaToSave: Carga;
  cargasDetallesToSave: CargasDetalles;
  nombreDestinoToSave: string;
  nombreOrigenToSave: string;
  nombreAyudanteToSave: string;

  ngOnInit() {
    this.configureOrigenesOptionsSubs();
    this.cargasService.fetchOrigenes();
    this.configureRouterParamsSubs();
    this.configureCargasForm();
  }

  configureOrigenesOptionsSubs() {
    this.cargasService.origenesLoaded.subscribe((loadedOrigenes: Origen[]) => {
      this.origenOptions = loadedOrigenes;
    });
  }

  configureRouterParamsSubs() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.fechaServicioView = queryParams.get('fechaServicio');
      this.camioneta = queryParams.get('camioneta');
      this.chofer = queryParams.get('chofer');
    });
  }

  configureCargasForm() {
    this.cargasForm = this.formBuilder.group({
      origen: '0',
      destino: null,
      productos: null,
      fechaCarga: this.fechaServicioView,
      camioneta: this.camioneta,
      hasAyudante: false,
      ayudante: null,
      productosDetail: this.formBuilder.array([])
    });

    this.origenSelect.valueChanges.subscribe(newOrigenValue => {
      if (newOrigenValue === '0') {
        this.currentDestino = null;
      }
      this.currentOrigen = this.findOrigenById(newOrigenValue);
      this.destinoSelect.reset('0');
      this.deleteAllSelectedProducts();
      this.productosSelect.reset([]);
    });

    this.destinoSelect.valueChanges.subscribe(newDestinoValue => {
      this.deleteAllSelectedProducts();
      this.currentDestino = this.findDestinoById(newDestinoValue);
      this.productosSelect.reset([]);
    });
  }

  submitViaje() {
    this.cargaToSave = {
      fechaCarga: this.fechaServicioView,
      fechaServicio: this.fechaServicioView,
      cargasDetalles: [
        {
          camioneta: this.camioneta,
          origenId: this.origenSelect.value,
          nombreOrigen: this.nombreOrigenToSave,
          destinoId: this.destinoSelect.value,
          nombreDestino: this.nombreDestinoToSave,
          chofer: this.chofer,
          ayudante: this.nombreAyudanteToSave,
          isViajeTerminado: false,
          productos: this.getProductosSeleccionadosInForm()
        }
      ]
    };
    this.cargaToSave.cargasDetalles[0].viajeIndex =
      this.viajesService.calculateViajeIndex(
        this.cargaToSave.cargasDetalles[0]
      ) + 1;
    console.log('carga to save: ' + JSON.stringify(this.cargaToSave));
    console.log(this.cargaToSave);
    this.viajesService.saveViaje(this.cargaToSave);
    this.router.navigate(['/viajes']);
  }

  get origenSelect(): AbstractControl {
    return this.cargasForm.get('origen');
  }

  get destinoSelect(): AbstractControl {
    return this.cargasForm.get('destino');
  }

  get productosSelect(): AbstractControl {
    return this.cargasForm.get('productos');
  }

  get hasAyudante(): AbstractControl {
    return this.cargasForm.get('hasAyudante');
  }

  get productosDetailsForms() {
    return this.cargasForm.get('productosDetail') as FormArray;
  }

  get fechaServicioFromFechaCarga() {
    return this.dateUtilsService.getNextBusinessDayFromDate(
      this.fechaServicioView
    );
  }

  addProductosDetailsForm() {
    const productoForm = this.formBuilder.group({
      cantidad: [],
      remision: [],
      lote: []
    });
    this.productosDetailsForms.push(productoForm);
  }

  deleteAllSelectedProducts() {
    this.productosDetailsForms.clear();
    this.productosSeleccionados.splice(0, this.productosSeleccionados.length);
  }

  deleteSelectedProductAt(i) {
    this.productosDetailsForms.removeAt(i);
    this.productosSeleccionados.splice(i, 1);
  }

  productChange(event, producto: Producto) {
    if (event.isUserInput && event.source.selected) {
      this.productosSeleccionados.push(producto);
      this.addProductosDetailsForm();
    } else if (event.isUserInput && !event.source.selected) {
      const productoToRemoveIndex = this.findIndexOfProduct(producto);
      this.deleteSelectedProductAt(productoToRemoveIndex);
    }
  }

  getProductosSeleccionadosInForm(): CargaProducto[] {
    const cargaProductosToSave: CargaProducto[] = [];
    let idx = 0;
    for (const selectedProduct of this.productosSeleccionados) {
      let cargaProductoToPush: CargaProducto;
      cargaProductoToPush = {
        productoId: this.productosSeleccionados[idx].id,
        nombreProducto: this.productosSeleccionados[idx].nombreProducto,
        unidadMedida: this.productosSeleccionados[idx].unidadMedida,
        unidadesPorMedida: this.productosSeleccionados[idx].unidadesPorMedida,
        cantidad: this.productosDetailsForms.at(idx).get('cantidad').value,
        remision: this.productosDetailsForms.at(idx).get('remision').value,
        lote: this.productosDetailsForms.at(idx).get('lote').value
      };
      cargaProductosToSave.push(cargaProductoToPush);
      idx++;
    }
    return cargaProductosToSave;
  }

  updateOrigenToSave(event, orig: Origen) {
    if (event.isUserInput) {
      this.nombreOrigenToSave = orig.nombreOrigen;
    }
  }

  updateDestinoToSave(event, destino: Destino) {
    if (event.isUserInput) {
      this.nombreDestinoToSave = destino.nombreDestino;
    }
  }

  updateAyudanteToSave(event, ayudante: string) {
    if (event.isUserInput) {
      this.nombreAyudanteToSave = ayudante;
    }
  }

  findIndexOfProduct(producto: Producto): number {
    let idx = 0;
    for (const prod of this.productosSeleccionados) {
      if (prod.id === producto.id) {
        return idx;
      }
      idx++;
    }
  }

  findOrigenById(origenId: string): Origen {
    for (const origen of this.origenOptions) {
      if (origen.id === origenId) {
        return origen;
      }
    }
    return null;
  }

  findDestinoById(destinoId: string): Destino {
    for (const destino of this.currentOrigen.destinos) {
      if (destino.id === destinoId) {
        return destino;
      }
    }
    return null;
  }
}
