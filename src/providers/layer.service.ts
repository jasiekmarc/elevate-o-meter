import {
    Component,
    Injectable,
    Injector,
    ApplicationRef,
    ComponentFactoryResolver,
} from "@angular/core";
import * as L from "leaflet";
import "drmonty-leaflet-awesome-markers";

import { TrackService } from "./track.state";

@Injectable()
export class CustomCompileService {

    private appRef: ApplicationRef;

    constructor(
        private injector: Injector,
        private resolver: ComponentFactoryResolver
    ) { }

    configure(appRef) {
        this.appRef = appRef;
    }

    compile(component, onAttach) {
        const compFactory = this.resolver.resolveComponentFactory(component);
        let compRef = compFactory.create(this.injector);

        if (onAttach)
            onAttach(compRef);

        this.appRef.attachView(compRef.hostView);
        compRef.onDestroy(() => this.appRef.detachView(compRef.hostView));

        let div = document.createElement('div');
        div.appendChild(compRef.location.nativeElement);
        return div;
    }
}

@Injectable()
export class LayerService {

    /* Range markers (flags) for peak-adding */
    rangeBe: number;
    rangeEn: number;

    hoveredPeakMarker: [number, number];

    trackGeoJSON: GeoJSON.LineString;

    peakMarkerAt: Map<number, number>;

    fitBounds: L.LatLngBounds = null;
    layers: L.Layer[] = [];

    appRef: ApplicationRef;

    constructor(public compileService: CustomCompileService) {
        compileService.configure(ApplicationRef);
    }

    moveRangeFlags(be: number, en: number) {
        this.rangeBe = be;
        this.rangeEn = en;

        (<L.Marker>this.layers[0]).setLatLng(this.coordinatesAtIndex(be));
        (<L.Marker>this.layers[1]).setLatLng(this.coordinatesAtIndex(en-1));
    }

    addPeakFlag(ind: number, ele: number) {
        this.peakMarkerAt.set(ind, this.layers.length);
        const marker = this.markerInLatLng(ind, 'terrain', 'orange');
        marker.bindPopup(null).setPopupContent(
            this.compileService.compile(
                PeakPopupComponent, (c) => {
                    c.instance.index = ind;
                    c.instance.ele = ele;
                })).on('mouseover', (_) => {
                    this.hoveredPeakMarker = [ind, ele];
                }).on('mouseout', (_) => {
                    this.hoveredPeakMarker = null;
                });
        this.layers.push(marker);
    }

    removePeakFlag(ind: number) {
        this.layers[this.peakMarkerAt.get(ind)].remove();
        console.log(this.layers[this.peakMarkerAt.get(ind)]);
    }

    active(): boolean {
        return !(this.trackGeoJSON == null);
    }

    loadTrack(track: GeoJSON.Feature<GeoJSON.LineString>) {
        this.layers.forEach(l => l.remove());
        this.layers.length = 0;
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
}

@Component({
    template: `
    <div>
        <p>Index: <strong>{{ index }}</strong><br>
        Altitude: <strong>{{ ele }}</strong></p>
        <button
            md-button
            color="warn"
            (click)="deletePeak()">
            <md-icon>delete</md-icon>
            Delete
        </button>
    </div>
    `,
})
export class PeakPopupComponent {
    index: number
    ele: number

    constructor(
        private layerService: LayerService,
        private trackService: TrackService) {}

    deletePeak() {
        console.log('Peak number', this.index, 'should be deleted');
        this.trackService.removePeak(this.index);
        this.layerService.removePeakFlag(this.index);
    }
}