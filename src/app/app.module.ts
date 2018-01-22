import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';



import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatSliderModule,
} from '@angular/material';


import { AppComponent } from './app.component';
import { MapComponent } from '../components/map/map';
import {
  JoystickComponent,
  FileUploadErrorDialog,
  GpxParseErrorDialog
} from '../components/joystick/joystick';
import { ChartComponent, PlottablePlot } from '../components/chart/chart';

import { TrackService } from '../providers/track.state';
import {
  LayerService,
  PeakPopupComponent,
  CustomCompileService
} from '../providers/layer.service';

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
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSliderModule,
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
