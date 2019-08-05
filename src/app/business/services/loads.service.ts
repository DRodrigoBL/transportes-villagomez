import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Load } from '../model/load.model';

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
}
