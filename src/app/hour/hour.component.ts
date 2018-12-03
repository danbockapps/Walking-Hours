import { Component, OnInit, Input } from '@angular/core';
import { Moment } from 'moment';
import { registerElement } from "nativescript-angular/element-registry";
import moment = require('moment');
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

	constructor() { }

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

	getEmojiShortName(): string {
		if(this.futureHour) {
			// Future
		  return '';
		}
		else if(this.goalMet()) {
			//TODO save these on a per-hour basis so they stay the same
			return this.getRandomHappyEmojiShortName();
		}
		else if(this.stepHour[1] <= 1) {
			return 'zzz';
		}
		else {
			return 'x';
		}
	}

	getRandomHappyEmojiShortName(): string {
		let candidates: Array<string> = [
			'grinning',
			'clap',
			'tada',
			'cowboy',
			'raised_hands',
			'thumbsup',
			'ok_hand',
			'dancer',
			'man_dancing'
		];
		return candidates[Math.floor(Math.random() * candidates.length)];
	}
}