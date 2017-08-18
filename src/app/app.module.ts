import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';


import { AppComponent } from './app.component';
import { MapComponent } from '../components/map/map';

import { TrackService } from "../providers/track.state";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
  ],
  providers: [
    TrackService,
  ],
  bootstrap: [
    AppComponent,
    MapComponent
  ]
})
export class AppModule { }
