import { Component, OnInit } from "@angular/core";
const firebase = require("nativescript-plugin-firebase");

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    ngOnInit() {
        firebase.init({}).then(
            instance => console.log('firebase.init done'),
            error => console.log(`firebase.init error: ${error}`)
        );
    }
}
