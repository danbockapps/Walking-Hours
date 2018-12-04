import { Component, OnInit } from "@angular/core";
import * as moment from 'moment';
import { Moment } from 'moment';
import { PedometerService, iOSPedometerDataPoint } from "../services/pedometer.service";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  // This is an array of tuples. Google TypeScript tuples.
  stepHours: Array<[Moment, number]>;

  constructor(private pedometerService: PedometerService) {}

  ngOnInit(): void {
    this.stepHours = [];
    this.pedometerService.queryDay(moment()).subscribe(
      (response:iOSPedometerDataPoint) => {
        this.stepHours.push([moment(response.startDate), response.steps]);
      }
    );
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
