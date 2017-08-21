import { Component } from "@angular/core";

import { TrackService } from "../../providers/track.state";

interface ChartData {
    name: string;
    series: {name: number, value: number}[];
}

@Component({
    selector: 'chart',
    templateUrl: 'chart.html',
    styleUrls: ['chart.css'],
})
export class ChartComponent {
    colorScheme = {
        domain: ['#03a9f4', '#FF5722', '#C7B42C', '#AAAAAA']
      };

    constructor(public trackService: TrackService) {}
}