import { Component, Input, HostListener } from "@angular/core";

import { TrackService } from "../../providers/track.state";
import {
    Axes,
    Components,
    Dataset,
    Plots,
    Scales
} from "plottable";

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



    constructor(public trackService: TrackService) {
    }
}

@Component({
    selector: 'plottable',
    template: `
    <div
        id="plot"
        class="plottable">
    </div>`,
})
export class PlottablePlot {
    @Input('orig-data') set origData(data: any[]) {
        this.origDataSet.data(data);
        this.xScale.domainMin(0);
        this.table.renderTo('div#plot');
    }
    @Input('comp-data') set compData(data: any[]) {
        this.compDataSet.data(data);
    }

    xScale = new Scales.Linear();
    yScale = new Scales.Linear().tickGenerator(
        Scales.TickGenerators.integerTickGenerator());
    xAxis = new Axes.Numeric(this.xScale, 'bottom').tickLabelPadding(0);
    yAxis = new Axes.Numeric(this.yScale, 'left');

    origDataSet = new Dataset();
    origPlot = new Plots.Line().addDataset(this.origDataSet)
        .x((d) => +d.name, this.xScale)
        .y((d) => +d.value, this.yScale)
        .attr('fill', '#81d4fa')
        .attr('stroke', '#03a9f4');

    compDataSet = new Dataset();
    compPlot = new Plots.Line().addDataset(this.compDataSet)
        .x((d) => +d.name, this.xScale)
        .y((d) => +d.value, this.yScale)
        .attr('stroke', '#FF5722')

    plots = new Components.Group([this.origPlot, this.compPlot]);
    table = new Components.Table([[this.yAxis, this.plots],
                                  [null,       this.xAxis]]);

    @HostListener('window:resize')
    onWindowResize() {
        this.table.redraw();
    }
}