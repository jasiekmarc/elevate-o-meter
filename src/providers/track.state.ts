import { Injectable } from "@angular/core";
import { LinkedList } from "typescript-dotnet-umd/System/Collections/LinkedList";
import { ILinkedListNode } from "typescript-dotnet-umd/System/Collections/ILinkedListNode";

export interface Peak {
    index: number;
    ele: number;
}

@Injectable()
export class TrackService {
    alts: Array<number>;
    extremePoints: LinkedList<number>;

    minR: Array<number>;
    minL: Array<number>;
    peakL: Array<number>;
    peakR: Array<number>

    constructor() {}

    /** Provided a GpxTrack object loads altitudes into  */
    loadTrack(feature: GeoJSON.Feature<GeoJSON.LineString>) {
        this.alts = feature.geometry.coordinates.map(wp => wp[2]);
        this.extremePoints.add(0)
        this.extremePoints.add(this.alts.length);

        this.minL = new Array(this.alts.length);
        this.minR = new Array(this.alts.length);
        this.peakL = new Array(this.alts.length);
        this.peakR = new Array(this.alts.length);

        this.updateMins();
    }

    private updateMins() {
        for (let it = this.extremePoints.first; it.next != null; it = it.next) {
            let curmin = this.alts[it.value];
            for (let i = it.value; i != it.next.value; i ++) {
                curmin = Math.min(curmin, this.alts[i]);
                this.minL[i] = curmin;
                this.peakL[i] = it.value;
            }
        }

        for (let it = this.extremePoints.last; it.previous != null;
             it = it.previous) {
            let curmin = this.alts[it.value - 1];
            for (let i = it.value - 1; i >= it.previous.value; i --) {
                curmin = Math.min(curmin, this.alts[i]);
                this.minR[i] = curmin;
                this.peakR[i] = it.value;
            }
        }
    }

    /**
     * Finds the first element on the extremePoints list that is not smaller
     * then pos.
     */
    private findUpperBound(pos: number): ILinkedListNode<number> {
        let it = this.extremePoints.first;
        while (it.value < pos) { it = it.next; }
        return it;
    }

    addPeak(be: number, en: number): Peak {
        let curmax: [number, number] = [1000000000, 1000000000];
        for (let i = be; i != en; i ++) {
            const cand = (this.alts[i] - this.minL[i]) +
                (this.alts[this.peakR[i]] - this.minR[i]);
            if (cand > curmax[0]) {
                curmax = [cand, i];
            }
        }
        const ub = this.findUpperBound(curmax[1]);
        ub.addBefore(curmax[1]);
        return { index: curmax[1], ele: this.alts[curmax[1]] };
    }

    removePeak(pos: number) {
        const el = this.findUpperBound(pos);
        el.remove();
    }

    /** Shows the current list of peaks with their altitudes */
    currentPeaks(): Array<Peak> {
        let ret = new Array();

        for (let it = this.extremePoints.first.next; it.next != null;
             it = it.next) {
            ret.push({
                index: it.value,
                ele: this.alts[it.value],
            });
        }
        return ret;
    }

    currentElevationGain(): number {
        return this.currentPeaks().reduce((preEle, curPeak) => {
            const curGain = curPeak.ele - this.minL[curPeak.index];
            return preEle + curGain;
        }, 0);
    }
}