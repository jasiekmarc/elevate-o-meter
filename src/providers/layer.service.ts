import { Injectable } from "@angular/core";
import * as L from "leaflet";

@Injectable()
export class LayerService {

    /* Range markers (flags) for peak-adding */
    rangeBe: L.Layer;
    rangeEn: L.Layer;

    trackGeoJSON: GeoJSON.LineString;

    peakMarkers: L.Layer[];

    moveRangeFlags(be: number, en: number) {
        this.rangeBe = L.marker([
            this.trackGeoJSON.coordinates[be].slice[0],
            this.trackGeoJSON.coordinates[be].slice[1]
        ], {
            icon: L.divIcon({
                html: '<i class="material-icons">chevron_right</i>'
            })
        });
        this.rangeEn = L.marker([this.trackGeoJSON.coordinates[en][0],
            this.trackGeoJSON.coordinates[en][1]], {
            icon: L.divIcon({
                html: '<i class="material-icons">chevron_left</i>'
            })
        });
    }

    addPeakFlag(ind: number, ele: number) {
        this.peakMarkers.push(L.marker([
            this.trackGeoJSON.coordinates[ind][0],
            this.trackGeoJSON.coordinates[ind][1]
        ], {
            icon: L.divIcon({
                html: '<i class="material-icons">terrain</i>'
            })
        }));
    }
}