import { Injectable } from "@angular/core";
import * as L from "leaflet";
import "drmonty-leaflet-awesome-markers";


@Injectable()
export class LayerService {

    /* Range markers (flags) for peak-adding */
    rangeBe: number;
    rangeEn: number;

    trackGeoJSON: GeoJSON.LineString;

    peakMarkerAt: Map<number, number>;

    fitBounds: L.LatLngBounds = null;

    moveRangeFlags(be: number, en: number) {
        this.rangeBe = be;
        this.rangeEn = en;

        (<L.Marker>this.layers[0]).setLatLng(this.coordinatesAtIndex(be));
        (<L.Marker>this.layers[1]).setLatLng(this.coordinatesAtIndex(en-1));
    }

    addPeakFlag(ind: number, ele: number) {
        this.peakMarkerAt.set(ind, this.layers.length);
        const marker = this.markerInLatLng(ind, 'terrain', 'orange');
        marker.bindPopup(`Index: <b>${ind}</b><br>Altitude: <b>${ele}</b>`);
        this.layers.push(marker);
    }

    active(): boolean {
        return !(this.trackGeoJSON == null);
    }

    loadTrack(track: GeoJSON.Feature<GeoJSON.LineString>) {
        this.peakMarkerAt = new Map();
        this.trackGeoJSON = track.geometry;

        this.layers.push(this.markerInLatLng(0, 'play', 'green'));
        this.layers.push(this.markerInLatLng(
            this.trackGeoJSON.coordinates.length-1, 'stop', 'red'));
        this.layers.push(L.geoJSON(this.trackGeoJSON, {
            style: (_) => {
                return {color: '#03a9f4', weight: 4};
            }
        }));
    }

    private coordinatesAtIndex(ind: number): [number, number] {
        return [
            this.trackGeoJSON.coordinates[ind][1],
            this.trackGeoJSON.coordinates[ind][0],
        ];
    }

    private markerInLatLng(index: number, name: string, color: string): L.Marker {
        return L.marker(this.coordinatesAtIndex(index), {
            icon:  L.AwesomeMarkers.icon({
                prefix: 'mdi',
                icon: name,
                markerColor: color,
            })
        });
    }

    layers: L.Layer[] = [];
}