import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';



import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MdButtonModule,
  MdCardModule,
  MdDialogModule,
  MdIconModule,
  MdSliderModule,
} from '@angular/material';


import { AppComponent } from './app.component';
import { MapComponent } from '../components/map/map';
import {
  JoystickComponent,
  FileUploadErrorDialog,
  GpxParseErrorDialog
} from '../components/joystick/joystick';
import { ChartComponent, PlottablePlot } from "../components/chart/chart";

import { TrackService } from "../providers/track.state";
import {
  LayerService,
  PeakPopupComponent,
  CustomCompileService
} from "../providers/layer.service";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    JoystickComponent,
    PlottablePlot,
    ChartComponent,
    FileUploadErrorDialog,
    GpxParseErrorDialog,
    PeakPopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),

    // Material Components
    FlexLayoutModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdIconModule,
    MdSliderModule,
  ],
  providers: [
    CustomCompileService,
    TrackService,
    LayerService,
  ],
  bootstrap: [
    AppComponent,
    MapComponent
  ],
  entryComponents: [
    FileUploadErrorDialog,
    GpxParseErrorDialog,
    PeakPopupComponent,
  ]
})
export class AppModule { }
