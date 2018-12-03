import { Component, OnInit, Input } from '@angular/core';
import { Moment } from 'moment';
import { registerElement } from "nativescript-angular/element-registry";
import moment = require('moment');
import { DatabaseService } from '../database/database.service';
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
	stepString: string;
	futureHour: boolean;

	constructor(private databaseService: DatabaseService) { }

	ngOnInit() {
		// For some reason it doesn't work to do this directly in the html.
		this.futureHour = parseInt(this.stepHour[0].format('H')) > parseInt(moment().format('H'));
		if(!this.futureHour) {
			this.stepString = new Intl.NumberFormat().format(this.stepHour[1]);
		}
	}

	goalMet(): boolean {
		return this.stepHour[1] >= 416;
	}

	getBackgroundColor(): string {
		return this.goalMet() ? "lightgreen" : "white";
	}

	getEmoji(): string {
		if(this.futureHour) {
			// Future
		  return '';
		}
		else if(this.goalMet()) {
			return this.databaseService.getEmojiShortName(this.stepHour[0].format('X'));
		}
		else if(this.stepHour[1] <= 1) {
			return 'zzz';
		}
		else {
			return 'x';
		}
	}
}