import { Component, OnInit } from "@angular/core";
import { Pedometer } from "nativescript-pedometer";
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  // This is an array of tuples. Google TypeScript tuples.
  stepHours: Array<[Moment, number]>;

  constructor() {}

  ngOnInit(): void {
    let pedometer = new Pedometer();
    pedometer.isStepCountingAvailable().then(avail => {
      console.log(`Step counting is available: ${avail}`);
    });

    let startOfDay: Moment = moment().startOf('day');
    this.stepHours = new Array();

    for(let i=0; i<24; i++) {
      let momentObj: Moment = moment(startOfDay).add(i, 'hours');
      pedometer.query({
        fromDate: momentObj.toDate(),
        toDate: moment(momentObj).add(1, 'hours').toDate()
      }).then(result => {
        this.stepHours[i] = [momentObj, result.steps];
      })
    }
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
