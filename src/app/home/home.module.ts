import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { HourComponent } from "../hour/hour.component";
import { DatabaseService } from "../database/database.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule
    ],
    declarations: [
        HomeComponent,
        HourComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        DatabaseService
    ]
})
export class HomeModule { }
