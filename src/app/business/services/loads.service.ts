import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Origen } from '../model/origen.model';
import { Carga } from '../model/carga.model';

@Injectable()
export class LoadsService {
  cargasByDateLoaded = new Subject<Carga>();
  cargasByDate: Carga;

  origenesLoaded = new Subject<Origen[]>();
  origenes: Origen[];

  private serviceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  public findCargasByDateStr(dateStr: string) {
    this.db
      .collection('cargas', ref => ref.where('fechaCarga', '==', dateStr))
      .valueChanges()
      .subscribe(
        (foundCargas: Carga[]) => {
          console.log('found cargas: ' + JSON.stringify(foundCargas));
          this.cargasByDate = foundCargas[0];

          this.cargasByDateLoaded.next({
            ...this.cargasByDate
          });
        },
        error => {
          console.log('Error occured while loading Cargas: ' + error.message);
          this.cargasByDateLoaded.next(null);
        }
      );
  }

  public saveInfo() {
    //   const info = '{"fechaCarga":"11/08/2019","cargasDetalles":[{"camioneta":"C04","chofer":"JUAN MANUEL OZUNA GUAPO","ayudante":"DAMIAN ANDRADE GRANILLO","origen":{"origenId":"1","nombreOrigen":"ROSHFRANS"},"destino":{"destinoId":"1","nombreDestino":"ACTOPAN"},"productos":[{"productoId":"10","nombreProducto":"IMPRESION AMARILLA","cantidad":10,"remision":"ABC","unidadMedida":"BOLSA","unidadesPorMedida":10}]}]}';
    //   const carga = JSON.parse(info);
    //   try {
    //     this.db.collection('cargas').add(carga);
    //   } catch (error) {
    //     console.log(error);
    //   }
  }

  public saveCarga(carga: Carga) {
    try {
      this.db.collection('cargas').add(carga);
    } catch (error) {
      console.log(error);
    }
  }

  public fetchOrigenes() {
    this.db
      .collection('origen-destino-producto')
      .valueChanges()
      .subscribe(
        (foundOrigenDestinoProducto: Origen[]) => {
          console.log(
            'found origenes: ' + JSON.stringify(foundOrigenDestinoProducto)
          );
          this.origenes = foundOrigenDestinoProducto;
          this.origenesLoaded.next(
            this.origenes.slice()
          );
        },
        error => {
          console.log('Error occured while loading Origenes: ' + error.message);
          this.cargasByDateLoaded.next(null);
        }
      );
  }

  cancelSubscriptions() {
    this.serviceSubs.forEach(sub => sub.unsubscribe());
  }
}
