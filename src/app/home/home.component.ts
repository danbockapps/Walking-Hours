import { Component, OnInit } from "@angular/core";
import * as moment from 'moment';
import { Moment } from 'moment';
import { PedometerService, iOSPedometerDataPoint } from "../services/pedometer.service";
import { on, suspendEvent, resumeEvent, ApplicationEventData } from 'tns-core-modules/application';
import { Subscription } from "rxjs";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  // This is an array of tuples. Google TypeScript tuples.
  stepHours: Array<[Moment, number]>;
  private updatesSubscription: Subscription;

  constructor(private pedometerService: PedometerService) {}

  ngOnInit(): void {
    this.stepHours = [];
    this.pedometerService.queryDay(moment()).subscribe(
      (response:iOSPedometerDataPoint) => {
        this.stepHours.push([moment(response.startDate), response.steps]);
      }
    );

    this.subscribeToPedometerUpdates();
    this.registerApplicationEvents();
  }

  subscribeToPedometerUpdates(): void {
    if(!this.updatesSubscription || this.updatesSubscription.closed) {
      this.updatesSubscription = this.pedometerService.startUpdates().subscribe(
        (resp: iOSPedometerDataPoint) => console.log(resp)
      );
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
      this.subscribeToPedometerUpdates();
    });
  }

  rowNum(stepHour: [Moment, number]): number {
    let returnable: number = parseInt(stepHour[0].format('H')) % 12;
    return returnable;
  }

  colNum(stepHour: [Moment, number]): number {
    // Columns 0 and 2 are for hours. Column 1 is the center divider.
    return stepHour[0].format('a') === 'am' ? 0 : 2;
  }
}
