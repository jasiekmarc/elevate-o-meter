import { Component } from "@angular/core";
import { FormsModule }   from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';
import * as tj from "@mapbox/togeojson";

import { TrackService } from "../../providers/track.state";
import { LayerService } from "../../providers/layer.service";

interface FileReaderEventTarget extends EventTarget {
    result:string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage():string;
}

class AddPeakModel {
    constructor(
        public be: number,
        public en: number,
    ) {}
}

@Component({
    selector: 'joystick',
    templateUrl: 'joystick.html',
    styleUrls: ['joystick.css'],
})
export class JoystickComponent {
    addPeakModel: AddPeakModel = new AddPeakModel(0, 100);
    peakRange: [number, number] = [0, 15];

    constructor(private trackService: TrackService,
        private layerService: LayerService,
        public dialog: MdDialog) {}

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
        if (fileList.length != 1) {
            this.dialog.open(FileUploadErrorDialog);
        }
        const reader = new FileReader();
        reader.onload = (e: FileReaderEvent) => {
            const gpxText = e.target.result;
            const gpxTree = new DOMParser().parseFromString(gpxText, 'text/xml');
            const geoJson: GeoJSON.FeatureCollection<GeoJSON.LineString> =
                tj.gpx(gpxTree);
            console.log(geoJson);
            if (geoJson.features.length == 0) {
                this.dialog.open(GpxParseErrorDialog);
            }
            this.trackService.loadTrack(geoJson.features[0]);
            this.layerService.loadTrack(geoJson.features[0]);
            this.addPeakModel = {be: 0, en: this.trackService.length()};
            this.layerService.fitBounds = L.geoJSON(
                this.layerService.trackGeoJSON).getBounds();
        };
        reader.readAsText(fileList[0]);
    }
}

@Component({
    template: '<p>Exactly one GPX file should be uploaded</p>'
})
class FileUploadErrorDialog {}

@Component({
    template: '<p>The GPX file should contain at least one track</p>'
})
class GpxParseErrorDialog {}