import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormArray
} from '@angular/forms';
import { Origen, Destino, Producto } from '../../model/origen.model';
import { LoadsService } from '../../services/loads.service';

@Component({
  selector: 'app-new-load',
  templateUrl: './new-load.component.html',
  styleUrls: ['./new-load.component.css']
})
export class NewLoadComponent implements OnInit {

  fechaServicio: string;
  camioneta: string;

  constructor(
    private formBuilder: FormBuilder,
    private cargasService: LoadsService,
    private route: ActivatedRoute
  ) {}


  cargasForm: FormGroup;
  origenOptions: Origen[];
  currentOrigen: Origen;
  currentDestino: Destino;
  productosSeleccionados: Producto[] = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.fechaServicio = queryParams.get('fechaCarga');
      this.camioneta = queryParams.get('camioneta');
      console.log('received fecha: ' + this.fechaServicio);
      console.log('camioneta received> ' + this.camioneta);
    });
    this.origenOptions = this.cargasService.fetchOrigenes();
    this.cargasForm = this.formBuilder.group({
      origen: '0',
      destino: null,
      productos: null,
      fechaCarga: this.fechaServicio,
      camioneta: this.camioneta,
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

  submitCarga() {
    console.log(JSON.stringify(this.cargasForm.value));
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

  get productosDetailsForms() {
    return this.cargasForm.get('productosDetail') as FormArray;
  }

  addProductosDetailsForm() {
    const productoForm = this.formBuilder.group({
      cantidad: [],
      remision: []
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
    console.log('prducto changed: ' + JSON.stringify(producto));
    console.log(event.source.value, event.source.selected);

    if (event.isUserInput && event.source.selected) {
      this.productosSeleccionados.push(producto);
      this.addProductosDetailsForm();
    } else if (event.isUserInput && !event.source.selected) {
      const productoToRemoveIndex = this.findIndexOfProduct(producto);
      this.deleteSelectedProductAt(productoToRemoveIndex);
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
