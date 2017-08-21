import { Injectable } from "@angular/core";
import { LinkedList } from "typescript-dotnet-commonjs/System/Collections/LinkedList";
import { ILinkedListNode } from "typescript-dotnet-commonjs/System/Collections/ILinkedListNode";

interface Peak {
    index: number;
    ele: number;
}

interface ChartData {
    name: string;
    series: {name: number, value: number}[];
}

@Injectable()
export class TrackService {
    alts: Array<number>;
    peaks: LinkedList<number>;

    minR: Array<number>;
    minL: Array<number>;
    peakL: Array<number>;
    peakR: Array<number>

    // For charts
    sparseAlts: Array<{name: number, value: number}>;
    chartData: ChartData[] = [];

    constructor() {}

    /** Provided a GpxTrack object loads altitudes into  */
    loadTrack(feature: GeoJSON.Feature<GeoJSON.LineString>) {
        this.alts = feature.geometry.coordinates.map(wp => wp[2]);

        const endFlags: number[] = [0, this.alts.length];
        this.peaks = new LinkedList<number>(endFlags);

        this.minL = new Array(this.alts.length);
        this.minR = new Array(this.alts.length);
        this.peakL = new Array(this.alts.length);
        this.peakR = new Array(this.alts.length);

        this.updateMins();

        this.sparseAlts = this.alts.map((val, ind) => {
            return {
                name: ind,
                value: val,
            };
        });
        this.updateChart();
    }

    private updateMins() {
        for (let it = this.peaks.first; it.next != null; it = it.next) {
            let curind = it.value;
            for (let i = it.value; i != it.next.value; i ++) {
                if (this.alts[i] < this.alts[curind]) {
                    curind = i;
                }
                this.minL[i] = curind;
                this.peakL[i] = it.value;
            }
        }

        for (let it = this.peaks.last; it.previous != null;
             it = it.previous) {
            let curind = it.value - 1;
            for (let i = it.value - 1; i >= it.previous.value; i --) {
                if (this.alts[i] < this.alts[curind]) {
                    curind = i;
                }
                this.minR[i] = curind;
                this.peakR[i] = it.value - 1;
            }
        }
    }

    private updateChart() {
        this.chartData = [
            {
                name: 'GPX recording',
                series: this.sparseAlts,
            },
            {
                name: 'Computed profile',
                series: this.currentExtremePoints().map(peak => {
                    return {
                        name: peak.index,
                        value: peak.ele,
                    }
                }),
            }
        ];
    }

    /**
     * Finds the first element on the extremePoints list that is not smaller
     * then pos.
     */
    private findUpperBound(pos: number): ILinkedListNode<number> {
        let it = this.peaks.first;
        while (it.value < pos) { it = it.next; }
        return it;
    }

    private gainWithPeakAtInd(ind: number): number {
        return this.alts[ind] - this.alts[this.minL[ind]] +
            this.alts[this.peakR[ind]] - this.alts[this.minR[ind]] -
            (this.alts[this.peakR[ind]] - this.alts[this.minL[this.peakR[ind]-1]]);
    }

    addPeak(be: number, en: number): Peak {
        let bestInd = 0, bestVal = -1000;
        for (let i = be; i != en; i ++) {
            const cand = this.gainWithPeakAtInd(i);
            if (cand > bestVal) {
                bestVal = cand, bestInd = i;
            }
        }
        console.log('Adding peak at', bestInd, ' ElevationGain', bestVal);
        console.log('Wybrany punkt bestInd', [bestInd, this.alts[bestInd]]);
        console.log('Wierzchołek po lewej', [this.peakL[bestInd], this.alts[this.peakL[bestInd]]]);
        console.log('Wierzchołek po prawej', [this.peakR[bestInd], this.alts[this.peakR[bestInd]]]);
        console.log('Najniższy punkt w lewo', [this.minL[bestInd], this.alts[this.minL[bestInd]]]);
        console.log('Najniższy punkt w prawo', [this.minR[bestInd], this.alts[this.minR[bestInd]]]);
        console.log('Najniższy punkt między wierzchołkami po obu stronach', [this.minL[this.peakR[bestInd]], this.alts[this.minL[this.peakR[bestInd]]]]);
        const ub = this.findUpperBound(bestInd);
        ub.addBefore(bestInd);
        this.updateMins();
        this.updateChart();
        return { index: bestInd, ele: this.alts[bestInd] };
    }

    removePeak(pos: number) {
        const el = this.findUpperBound(pos);
        el.remove();
        this.updateMins();
        this.updateChart();
    }

    /** Shows the current list of peaks with their altitudes */
    currentPeaks(): Array<Peak> {
        let ret = new Array();

        for (let it = this.peaks.first.next; it.next != null;
             it = it.next) {
            ret.push({
                index: it.value,
                ele: this.alts[it.value],
            });
        }
        return ret;
    }

    /** Returns the current list of extreme points with their altitudes. */
    currentExtremePoints(): Array<Peak> {
        let ret = [{ index: 0, ele: this.alts[0] }];
        for (let it = this.peaks.first; it.next != null; it = it.next) {
            ret.push({
                index: this.minL[it.next.value-1],
                ele: this.alts[this.minL[it.next.value-1]],
            });
            ret.push({
                index: it.next.value-1,
                ele: this.alts[it.next.value-1]
            });
        }
        return ret;
    }

    length(): number {
        if (this.alts == null)
            return 1;
        return this.alts.length;
    }

    currentElevationGain(): number {
        if (this.alts == null) { return 0; }
        let sum = 0;
        for (let it = this.peaks.first; it.next != null; it = it.next) {
            sum += this.alts[it.next.value-1] -
                this.alts[this.minL[it.next.value-1]];
        }
        return sum;
    }
}