import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import * as moment from 'moment';
import { Moment } from 'moment';
import { PedometerService } from "../services/pedometer.service";
import { on, suspendEvent, resumeEvent, ApplicationEventData } from 'tns-core-modules/application';
import { Subscription, interval } from "rxjs";
import { PedometerUpdate } from "nativescript-pedometer";
import * as _ from "lodash";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  stepHours: StepTimeHash;
  stepDays: StepTimeHash;
  private updatesSubscription: Subscription;
  curViewDate: Date; // Midnight of the date currently being viewed

  constructor(private pedometerService: PedometerService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.curViewDate = moment().startOf('day').toDate();
    this.stepHours = {};
    this.stepDays = {};
    this.queryDay(moment());
    this.subscribeToPedometerUpdates();
    this.registerApplicationEvents();
  }

  queryDay(day: Moment) {
    this.pedometerService.queryDay(day).subscribe(this.collectUpdate);
  }

  subscribeToPedometerUpdates(): void {
    if(!this.updatesSubscription || this.updatesSubscription.closed) {
      this.updatesSubscription = this.pedometerService.startUpdates().subscribe(this.collectUpdateAndRefresh);
    }
  }

  // Adds steps from a PedometerUpdate into the stepsHours property
  // Doing it this way with the = and the => makes it use the right "this".
  collectUpdate = (resp: PedometerUpdate) => {
    this.stepHours[moment(resp.startDate).unix()] = resp.steps;
    this.stepDays[moment(this.curViewDate).unix()] = 
        this.getTotalSteps(this.todaysStepHours(this.curViewDate));
  }

  // startUpdates is on a different thread, so detectChanges has to be called
  collectUpdateAndRefresh = (resp: PedometerUpdate) => {
    if(moment().startOf('hour').isSame(resp.startDate)) {
      // It's still the same hour it was when the updates started
      this.collectUpdate(resp);
      console.log(`Steps received: ${resp.steps} ${moment(resp.startDate).format('ha')}`);
      this.changeDetectorRef.detectChanges();
    }
    else {
      // It's a new hour. Refresh!
      this.unsubscribeFromPedometerUpdates();
      this.queryDay(moment());
      this.subscribeToPedometerUpdates();
    }
  }

  unsubscribeFromPedometerUpdates(): void {
    this.updatesSubscription.unsubscribe();
  }

  registerApplicationEvents(): void {
    on(suspendEvent, (args: ApplicationEventData) => {
      this.unsubscribeFromPedometerUpdates();
    });
    
    on(resumeEvent, (args: ApplicationEventData) => {
      this.queryDay(moment());
      this.subscribeToPedometerUpdates();
    });
  }

  todaysStepHours(curViewDate: Date): Array<[Moment, number]> {
    // https://blog.mariusschulz.com/2015/05/14/implicit-function-chains-in-lodash
    // pickBy filters this.stepHours down to only the elements in curViewDate
    // mapValues returns an obj with both key (moment) and value (steps) in the value
    // values turns that into an array of tuples
    // value is the explicit end of the method chain.
    const returnable: any = _(this.stepHours).pickBy(
      (value: number, key: string) => moment.unix(parseInt(key)).startOf('day').isSame(curViewDate)
    ).mapValues(
      (value: number, key: string) => [moment.unix(parseInt(key)), value] // This is called a tuple.
    ).values().value();

    return returnable;
  }

  getTotalSteps(hoursArray: Array<[Moment, number]>): number {
    return hoursArray.reduce(
      (accumulator: number, element: [Moment, number]) => accumulator + element[1]
    , 0);
  }

  getWholeDayStepHour(curViewDate: Date): [Moment, number] {
    return [moment(curViewDate), this.stepDays[moment(curViewDate).unix()]];
  }

  rowNum(stepHour: [Moment, number]): number {
    let returnable: number = parseInt(stepHour[0].format('H')) % 12 + 1;
    return returnable;
  }

  colNum(stepHour: [Moment, number]): number {
    // Columns 0 and 2 are for hours. Column 1 is the center divider.
    return stepHour[0].format('a') === 'am' ? 0 : 2;
  }
}

interface StepTimeHash {
  // Index is the unix timestamp of the start of an hour.
  // Value is the number of steps for that hour.

  // This is called an "index signature".
  [index: number]: number;
}