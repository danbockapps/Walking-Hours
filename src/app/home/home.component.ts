import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import * as moment from 'moment';
import { Moment } from 'moment';
import { PedometerService, iOSPedometerDataPoint } from "../services/pedometer.service";
import { on, suspendEvent, resumeEvent, ApplicationEventData } from 'tns-core-modules/application';
import { Subscription, interval } from "rxjs";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  // This is an array of tuples. Google TypeScript tuples.
  stepHours: Array<[Moment, number]>;
  stepHoursUi: Array<[Moment, number]>;
  private updatesSubscription: Subscription;
  private intervalSubscription: Subscription;
  curViewDate: Date; // Midnight of the date currently being viewed

  constructor(private pedometerService: PedometerService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.curViewDate = moment().startOf('day').toDate();
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
        (resp: iOSPedometerDataPoint) => {
          this.stepHours.forEach((element: [Moment, number]) => {
            if(element[0].isSame(moment(resp.startDate))) {
              element[1] = resp.steps;
              console.log(`Steps received: ${resp.steps}`);
            }
          });
        }
      );
    }

    // WARNING: Horrible hack
    // Unfortunately I have to use this until I get an answer to this question:
    // https://stackoverflow.com/questions/53693956/delay-with-property-binding-in-nativescript-angular-app
    if(!this.intervalSubscription || this.intervalSubscription.closed) {
      this.intervalSubscription = interval(1000).subscribe(
        () => this.stepHoursUi = this.stepHours
      );
    }
  }

  unsubscribeFromPedometerUpdates(): void {
    this.updatesSubscription.unsubscribe();
    this.intervalSubscription.unsubscribe();
  }

  registerApplicationEvents(): void {
    on(suspendEvent, (args: ApplicationEventData) => {
      this.unsubscribeFromPedometerUpdates();
    });
    
    on(resumeEvent, (args: ApplicationEventData) => {
      this.subscribeToPedometerUpdates();
    });
  }

  todaysStepHours(curViewDate): Array<[Moment, number]> {
    return this.stepHours.filter((element: [Moment, number]) => {
      return moment(element[0]).startOf('day').isSame(curViewDate);
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
