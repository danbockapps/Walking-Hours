import { Component, OnInit, Input } from '@angular/core';
import { Moment } from 'moment';

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

	constructor() { }

	ngOnInit() {
		// For some reason it doesn't work to do this directly in the html.
		this.stepString = new Intl.NumberFormat().format(this.stepHour[1]);
	}

	getBackgroundColor(): string {
		return this.stepHour[1] >= 450 ? "green" : "white";
	}
}