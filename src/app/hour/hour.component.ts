import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { Moment } from 'moment';
import { registerElement } from "nativescript-angular/element-registry";
import moment = require('moment');
import { DatabaseService } from '../services/database.service';
registerElement("Emoji", () => require("nativescript-emoji").Emoji);

@Component({
	moduleId: module.id,
	// "walk" is the custom prefix for this app.
	// https://angular.io/guide/styleguide#component-custom-prefix
	selector: 'walk-hour',
	templateUrl: './hour.component.html',
	styleUrls: ['./hour.component.css']
})

export class HourComponent implements OnInit {
	// This is called a tuple. Google TypeScript tuples.
	@Input() stepHour: [Moment, number];
	@Input() wholeDay: boolean;

	constructor(private databaseService: DatabaseService) { }

	ngOnInit() { }

	isCurrentHour(): boolean {
		const comp: Moment = this.wholeDay ? moment().startOf('day') : moment();
		return this.stepHour[0].format('H') === comp.format('H');
	}

	isFutureHour(): boolean {
		return parseInt(this.stepHour[0].format('H')) > parseInt(moment().format('H'));
	}

	getGoal(): number {
		if(this.wholeDay) {
			return 10000;
		}
		else {
			return 416;
		}
	}

	goalMet(): boolean {
		return this.stepHour[1] >= this.getGoal();
	}

	getWidth(): string {
		if(!this.stepHour[1]) {
			return '0%';
		}
		else if(!this.isCurrentHour()) {
			return '100%';
		}
		else {
			return Math.min(100, this.stepHour[1] * 100 / this.getGoal()) + '%';
		}
	}

	getBackgroundColor(): string {
		if(this.goalMet()) {
			return "lightgreen";
		}
		else if(this.isCurrentHour()) {
			return "lightgray";
		}
		else {
			return "white";
		}
	}

	getEmoji(): string {
		if(this.goalMet()) {
			return this.databaseService.getEmojiShortName(this.stepHour[0].format('X'));
		}
		else if(this.isFutureHour() || this.isCurrentHour()) {
			return '';
		}
		else if(this.stepHour[1] <= 1) {
			return 'zzz';
		}
		else {
			return 'x';
		}
	}
}