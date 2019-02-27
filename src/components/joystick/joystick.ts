import { Component, ApplicationRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import * as tj from '@mapbox/togeojson';
import * as L from 'leaflet';

import { TrackService } from '../../providers/track.state';
import { LayerService } from '../../providers/layer.service';

class AddPeakModel {
  constructor(
    public be: number,
    public en: number,
  ) { }
}

@Component({
  selector: 'joystick',
  templateUrl: 'joystick.html',
  styleUrls: ['joystick.css'],
})
export class JoystickComponent implements OnInit {
  addPeakModel: AddPeakModel = new AddPeakModel(0, 100);

  constructor(public trackService: TrackService,
    public layerService: LayerService,
    public dialog: MatDialog,
    private appRef: ApplicationRef) { }

  ngOnInit() {
    this.layerService.compileService.configure(this.appRef);
  }

  beChanged() {
    this.addPeakModel.en = Math.max(this.addPeakModel.be,
      this.addPeakModel.en);
    this.layerService.moveRangeFlags(this.addPeakModel.be,
      this.addPeakModel.en);
  }

  enChanged() {
    this.addPeakModel.be = Math.min(this.addPeakModel.be,
      this.addPeakModel.en);
    this.layerService.moveRangeFlags(this.addPeakModel.be,
      this.addPeakModel.en);
  }

  addPeak() {
    const peak = this.trackService.addPeak(this.addPeakModel.be,
      this.addPeakModel.en);
    console.log(peak);
    this.layerService.addPeakFlag(peak.index, peak.ele);
  }


  selectUploadedTrack(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      this.dialog.open(FileUploadErrorDialogComponent);
    }
    const reader = new FileReader();
    reader.onload = () => {
      const gpxText = <string>reader.result;
      const gpxTree = new DOMParser().parseFromString(gpxText, 'text/xml');
      const geoJson: GeoJSON.FeatureCollection<GeoJSON.LineString> =
        tj.gpx(gpxTree);
      console.log(geoJson);
      if (geoJson.features.length === 0) {
        this.dialog.open(GpxParseErrorDialogComponent);
      }
      this.trackService.loadTrack(geoJson.features[0]);
      this.layerService.loadTrack(geoJson.features[0]);
      this.addPeakModel = { be: 0, en: this.trackService.length() };
      this.layerService.fitBounds = L.geoJSON(
        this.layerService.trackGeoJSON).getBounds();
    };
    reader.readAsText(fileList[0]);
  }
}

@Component({
  template: '<p>Uploading the GPX file failed.</p>'
})
export class FileUploadErrorDialogComponent { }

@Component({
  template: '<p>The GPX file parsing did not succeed.</p>'
})
export class GpxParseErrorDialogComponent { }
