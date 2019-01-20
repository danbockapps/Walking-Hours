import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { HourComponent } from "../hour/hour.component";
import { DatabaseService } from "../services/database.service";
import { PedometerService } from "../services/pedometer.service";
import { HourPipe } from "../pipes/hour.pipe";
import { DayPipe } from "../pipes/day.pipe";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule
    ],
    declarations: [
        HomeComponent,
        HourComponent,
        DayPipe,
        HourPipe
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        DatabaseService,
        PedometerService
    ]
})
export class HomeModule { }
