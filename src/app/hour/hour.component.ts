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
	@Input() momentObj: Moment;	

	constructor() { }

	ngOnInit() { }
}