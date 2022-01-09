import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';



import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';


import { AppComponent } from './app.component';
import { MapComponent } from '../components/map/map';
import {
  JoystickComponent,
  FileUploadErrorDialogComponent,
  GpxParseErrorDialogComponent
} from '../components/joystick/joystick';
import { ChartComponent, PlottablePlotComponent } from '../components/chart/chart';

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
    PlottablePlotComponent,
    ChartComponent,
    FileUploadErrorDialogComponent,
    GpxParseErrorDialogComponent,
    PeakPopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    LeafletModule,

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
    FileUploadErrorDialogComponent,
    GpxParseErrorDialogComponent,
    PeakPopupComponent,
  ]
})
export class AppModule { }
