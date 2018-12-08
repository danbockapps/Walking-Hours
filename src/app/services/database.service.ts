import { Injectable } from '@angular/core';
import { Couchbase } from 'nativescript-couchbase-plugin';

@Injectable({
	// This makes the service a singleton
	providedIn: 'root'
})
export class DatabaseService {
	// Underscore var combined with "get" below is ts convention
	// https://www.typescriptlang.org/docs/handbook/classes.html
	private _database: Couchbase;

	constructor() {
		this._database = new Couchbase('test-database');
	}

	get database(): Couchbase {
		return this._database;
	}

	getEmojiShortName(id: string): string {
		let emojiFromDb = this.database.getDocument(id);
		if(emojiFromDb) {
			return emojiFromDb.emojiShortName;
		}
		else {
			let emojiShortName = this.getRandomHappyEmojiShortName();
			this.database.createDocument({emojiShortName}, id);
			return emojiShortName;
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