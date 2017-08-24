import { Component, Input, HostListener } from "@angular/core";

import { TrackService } from "../../providers/track.state";
import { LayerService } from "../../providers/layer.service";
import {
    Axes,
    Components,
    Dataset,
    Plots,
    Scales
} from "plottable";

interface ChartData {
    name: string;
    series: { name: number, value: number }[];
}

@Component({
    selector: 'chart',
    templateUrl: 'chart.html',
    styleUrls: ['chart.css'],
})
export class ChartComponent {
    constructor(public trackService: TrackService,
        public layerService: LayerService) {
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
    @Input('orig-data') set origData(data: { name: number, value: number }[]) {
        this.origDataSet.data(data);
        this.xScale.domainMin(0);
        this.xScale.domainMax(data.length);
        this.yScale.domainMin(Math.min(...data.map((d) => d.value)));
        this.table.renderTo('div#plot');
        this.table.redraw();
    }
    @Input('comp-data') set compData(data: any[]) {
        this.compDataSet.data(data);
    }

    @Input('range-flags') set flagBe(poss: [number, number]) {
        this.rangeFlagsDataSet.data([{ be: 0, en: poss[0] },
        { be: poss[1], en: this.xScale.domainMax() }]);
    }

    @Input('hover-peak') set hoverPeak(peak: number) {
        if (peak == null) {
            this.hoverPeakDataSet.data([]);
        } else {
            this.hoverPeakDataSet.data([peak]);
        }
    }

    xScale = new Scales.Linear();
    yScale = new Scales.Linear().tickGenerator(
        Scales.TickGenerators.integerTickGenerator());
    xAxis = new Axes.Numeric(this.xScale, 'bottom').tickLabelPadding(0);
    yAxis = new Axes.Numeric(this.yScale, 'left');

    origDataSet = new Dataset();
    origPlot = new Plots.Area().addDataset(this.origDataSet)
        .x((d) => +d.name, this.xScale)
        .y((d) => +d.value, this.yScale)
        .attr('fill', '#81d4fa')
        .attr('stroke', '#03a9f4');

    compDataSet = new Dataset();
    compPlot = new Plots.Line().addDataset(this.compDataSet)
        .x((d) => +d.name, this.xScale)
        .y((d) => +d.value, this.yScale)
        .attr('stroke', '#ff5722');

    rangeFlagsDataSet = new Dataset();
    rangePlot = new Plots.Rectangle().addDataset(this.rangeFlagsDataSet)
        .x((d) => d.be, this.xScale)
        .x2((d) => d.en)
        .y((_) => 0)
        .y2((_) => this.rangePlot.height())
        .attr('fill', '#b0bec5')
        .attr('stroke', '#78909c')
        .attr("opacity", 0.3);

    hoverPeakDataSet = new Dataset();
    hoverPeakPlot = new Plots.Scatter().addDataset(this.hoverPeakDataSet)
        .x((d) => d[0], this.xScale)
        .y((d) => d[1], this.yScale)
        .size(30)
        .attr('fill', '#ff5722');

    plots = new Components.Group([this.origPlot, this.compPlot, this.rangePlot, this.hoverPeakPlot]);
    table = new Components.Table([[this.yAxis, this.plots]]);

    @HostListener('window:resize')
    onWindowResize() {
        this.table.redraw();
    }
}