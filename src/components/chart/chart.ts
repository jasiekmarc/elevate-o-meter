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
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
      };

    constructor(private trackService: TrackService) {}
}