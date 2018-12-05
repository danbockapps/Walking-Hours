import { Injectable } from "@angular/core";
import { Pedometer } from "nativescript-pedometer";
import { Observable, from, merge } from "rxjs";
import * as moment from 'moment';
import { Moment } from 'moment';

@Injectable({
	// This makes the service a singleton
	providedIn: 'root'
})
export class PedometerService {
  private _pedometer: Pedometer;

  constructor() {
    this._pedometer = new Pedometer();
  }

  queryDay(date: Moment): Observable<iOSPedometerDataPoint> {
    let startOfDay: Moment = moment(date).startOf('day');
    let obsArray = new Array<Observable<any>>();

    for(let i=0; i<24; i++) {
      obsArray[i] = from(this._pedometer.query({
        fromDate: moment(startOfDay).add(i, 'hours').toDate(),
        toDate: moment(startOfDay).add(i+1, 'hours').toDate()
      }));
    }

    return merge(...obsArray);
  }

  startUpdates(): Observable<iOSPedometerDataPoint> {
    return Observable.create((observer) => {
      this._pedometer.startUpdates({
        fromDate: moment().startOf('hour').toDate(),
        onUpdate: (result: iOSPedometerDataPoint) => {
          observer.next(result);
        }
      });

      // This gets run when the observable is unsubscribed from
      return () => this._pedometer.stopUpdates();
    });
  }
}

export interface iOSPedometerDataPoint {
  startDate: Date;
  endDate: Date;
  steps: number;
  distance: number;
  floorsAscended: number;
  floorsDescended: number;
  currentPace: number;
  currentCadence: number;
  averageActivePace: number;
}