import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MdButtonModule,
  MdDialogModule,
  MdIconModule,
  MdSliderModule,
} from '@angular/material';


import { AppComponent } from './app.component';
import { MapComponent } from '../components/map/map';
import { JoystickComponent } from '../components/joystick/joystick';

import { TrackService } from "../providers/track.state";
import { LayerService } from "../providers/layer.service";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    JoystickComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),

    // Material Components
    FlexLayoutModule,
    MdButtonModule,
    MdDialogModule,
    MdIconModule,
    MdSliderModule,
  ],
  providers: [
    TrackService,
    LayerService,
  ],
  bootstrap: [
    AppComponent,
    MapComponent
  ]
})
export class AppModule { }
