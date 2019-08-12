import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Load } from '../model/load.model';
import { Origen } from '../model/origen.model';

@Injectable()
export class LoadsService {
  loadsByDateLoaded = new Subject<Load[]>();
  loadsByDate: Load[];

  private serviceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  public findLoadsByDateStr(dateStr: string) {
    this.db
      .collection('loads', ref => ref.where('fechaStr', '==', dateStr))
      .valueChanges()
      .subscribe(
        (foundLoads: Load[]) => {
          this.loadsByDate = foundLoads;
          this.loadsByDateLoaded.next([...this.loadsByDate]);
        },
        error => {
          console.log('Error occured while loading Trucks: ' + error.message);
          this.loadsByDateLoaded.next(null);
        }
      );
  }

  cancelSubscriptions() {
    this.serviceSubs.forEach(sub => sub.unsubscribe());
  }

  fetchOrigenes(): Origen[] {
    return [
      {
        id: '1',
        nombreOrigen: 'ROSHFRANS',
        destinos: [
          {
            id: '1',
            nombreDestino: 'ACTOPAN',
            productos: [
              {
                id: '1',
                unidadMedida: 'BOLSA',
                nombreProducto: 'IMPRESIÓN AMARILLA',
                unidadesPorMedida: 10
              },
              {
                id: '10',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 10',
                unidadesPorMedida: 10
              },
              {
                id: '20',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 20',
                unidadesPorMedida: 10
              }
            ]
          },
          {
            id: '2',
            nombreDestino: 'INNOVADOR',
            productos: [
              {
                id: '2',
                unidadMedida: 'BOLSA',
                nombreProducto: 'GARRAFA AZUL DE 9 LTS',
                unidadesPorMedida: 10
              },
              {
                id: '30',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 30',
                unidadesPorMedida: 10
              },
              {
                id: '40',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 40',
                unidadesPorMedida: 10
              }
            ]
          },
          {
            id: '3',
            nombreDestino: 'KORES',
            productos: [
              {
                id: '3',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO DE KORES',
                unidadesPorMedida: 10
              },
              {
                id: '50',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 50',
                unidadesPorMedida: 10
              },
              {
                id: '60',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 60',
                unidadesPorMedida: 10
              }
            ]
          },
          {
            id: '4',
            nombreDestino: 'EL OSO',
            productos: [
              {
                id: '4',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO DEL OSO',
                unidadesPorMedida: 10
              },
              {
                id: '70',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 70',
                unidadesPorMedida: 10
              },
              {
                id: '80',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 80',
                unidadesPorMedida: 10
              }
            ]
          }
        ]
      },
      {
        id: '2',
        nombreOrigen: 'ACTOPAN',
        destinos: [
          {
            id: '2',
            nombreDestino: 'INNOVADOR',
            productos: [
              {
                id: '5',
                unidadMedida: 'BOLSA',
                nombreProducto: 'ENVASE DE 1 LT',
                unidadesPorMedida: 10
              },
              {
                id: '88',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 88',
                unidadesPorMedida: 10
              },
              {
                id: '77',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 77',
                unidadesPorMedida: 10
              }
            ]
          },
          {
            id: '3',
            nombreDestino: 'KORES',
            productos: [
              {
                id: '6',
                unidadMedida: 'CAJA',
                nombreProducto: 'PRODUCTO DE KORES',
                unidadesPorMedida: 10
              },
              {
                id: '66',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 66',
                unidadesPorMedida: 10
              },
              {
                id: '55',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 55',
                unidadesPorMedida: 10
              }
            ]
          },
          {
            id: '4',
            nombreDestino: 'EL OSO',
            productos: [
              {
                id: '7',
                unidadMedida: 'CAJA',
                nombreProducto: 'PRODUCTO DEL OSO',
                unidadesPorMedida: 10
              },
              {
                id: '44',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 44',
                unidadesPorMedida: 10
              },
              {
                id: '33',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 33',
                unidadesPorMedida: 10
              }
            ]
          },
          {
            id: '5',
            nombreDestino: 'CICORP',
            productos: [
              {
                id: '8',
                unidadMedida: 'CAJA',
                nombreProducto: 'ADITIVO 350 ML. PET',
                unidadesPorMedida: 10
              },
              {
                id: '11',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 11',
                unidadesPorMedida: 10
              },
              {
                id: '22',
                unidadMedida: 'BOLSA',
                nombreProducto: 'PRODUCTO 22',
                unidadesPorMedida: 10
              }
            ]
          }
        ]
      }
    ];
  }
}
