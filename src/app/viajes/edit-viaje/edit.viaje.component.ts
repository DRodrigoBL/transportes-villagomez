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
import { LoadsService } from '../../business/services/loads.service';
import { Origen, Destino, Producto } from '../../business/model/origen.model';
import {
  Carga,
  CargasDetalles,
  CargaProducto
} from '../../business/model/carga.model';
import { DateUtilsService } from 'src/app/shared/services/date.utils.service';
import { ViajesService } from '../../shared/services/viajes.service';

@Component({
  selector: 'app-edit-viaje',
  templateUrl: './edit.viaje.component.html',
  styleUrls: ['./edit.viaje.component.css']
})
export class EditViajesComponent implements OnInit {
  // router params
  fechaServicioView: string;
  camioneta: string;
  chofer: string;
  viajeIndex: number;

  constructor(
    private formBuilder: FormBuilder,
    private cargasService: LoadsService,
    private viajesService: ViajesService,
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

  origenIdToEdit: string;
  destinoIdToEdit: string;

  viajeToEdit: Carga;
  cargaToSave: Carga;
  cargasDetallesToSave: CargasDetalles;
  nombreDestinoToSave: string;
  nombreOrigenToSave: string;
  nombreAyudanteToSave: string;

  viajesOnDateLoaded: Carga;

  ngOnInit() {
    this.configureRouterParamsSubs();
    this.configureCargasForm();
    this.configureOrigenesOptionsSubs();
    this.configureViajeSubscription();
  }

  configureRouterParamsSubs() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.fechaServicioView = queryParams.get('fechaServicio');
      this.camioneta = queryParams.get('camioneta');
      this.chofer = queryParams.get('chofer');
      this.viajeIndex = +queryParams.get('viajeIndex');
      console.log('viaje index: ' + this.viajeIndex);
      this.cargasService.fetchOrigenes();
    });
  }

  configureOrigenesOptionsSubs() {
    this.cargasService.origenesLoaded.subscribe((loadedOrigenes: Origen[]) => {
      this.origenOptions = loadedOrigenes;
      this.viajesService.findViajesByDateStr(this.fechaServicioView);
    });
  }

  configureViajeSubscription() {
    this.viajesService.viajesByDateLoaded.subscribe((loadedViajes: Carga) => {
      this.viajesOnDateLoaded = loadedViajes;
      if (!this.viajesOnDateLoaded) {
        console.log('no hay viajes');
      }
      console.log(
        'loaded cargas in edit-viaje component: ' +
          JSON.stringify(this.viajesOnDateLoaded)
      );
      this.viajeToEdit = this.findViajeToEdit();
      this.findViajeToEditFormInitValues();
    });
  }

  findViajeToEdit(): Carga {
    for (const viajeDetalles of this.viajesOnDateLoaded.cargasDetalles) {
      if (
        viajeDetalles.camioneta === this.camioneta &&
        viajeDetalles.viajeIndex === this.viajeIndex
      ) {
        return {
          fechaCarga: this.fechaServicioView,
          fechaServicio: this.viajesOnDateLoaded.fechaServicio,
          cargasDetalles: [viajeDetalles]
        };
      }
    }
    return null;
  }

  findViajeToEditFormInitValues() {
    const cargaDetallesValues = this.viajeToEdit.cargasDetalles[0];
    this.origenSelect.setValue(cargaDetallesValues.origenId);
    this.destinoSelect.setValue(cargaDetallesValues.destinoId);
    this.hasAyudante.setValue(cargaDetallesValues.ayudante ? true : false);
    const productosToEdit = [];
    for (const producto of cargaDetallesValues.productos) {
      productosToEdit.push(producto.productoId);
    }
    this.productosSelect.setValue(productosToEdit);
  }

  configureCargasForm() {
    this.cargasForm = this.formBuilder.group({
      origen: this.origenIdToEdit,
      destino: this.destinoIdToEdit,
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
    });

    this.destinoSelect.valueChanges.subscribe(newDestinoValue => {
      this.deleteAllSelectedProducts();
      this.currentDestino = this.findDestinoById(newDestinoValue);
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
          viajeIndex: this.viajeIndex,
          isViajeTerminado: false,
          chofer: this.chofer,
          ayudante: this.nombreAyudanteToSave,
          productos: this.getProductosSeleccionadosInForm()
        }
      ]
    };
    console.log('carga to save: ' + JSON.stringify(this.cargaToSave));
    this.viajesService.updateViaje(this.cargaToSave);
    this.router.navigate(['/viajes']);
    // this.cargasService.updateCarga(this.cargaToSave);
  }

  // method to access form controls.

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

  // methods to operate form information.
  addProductosDetailsForm(productoIdToAdd: string) {
    const cargaDetallesValues = this.viajeToEdit.cargasDetalles[0];
    let cantidadToAdd: number;
    let remisionToAdd: string;
    let loteToAdd: string;
    for (const producto of cargaDetallesValues.productos) {
      if (producto.productoId === productoIdToAdd) {
        cantidadToAdd = producto.cantidad;
        remisionToAdd = producto.remision;
        loteToAdd = producto.lote;
      }
    }
    const productoForm = this.formBuilder.group({
      cantidad: cantidadToAdd,
      remision: remisionToAdd,
      lote: loteToAdd
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
    console.log('producto changed');
    console.log(producto);
    if (event.source.selected) {
      this.productosSeleccionados.push(producto);
      this.addProductosDetailsForm(producto.id);
    } else if (!event.source.selected) {
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
