import { Component, Input, HostListener } from '@angular/core';

import { TrackService } from '../../providers/track.state';
import { LayerService } from '../../providers/layer.service';
import {
  Axes,
  Components,
  Dataset,
  Plots,
  Scales,
  Scale,
} from 'plottable';
import { Group, Table } from 'plottable/build/src/components';
import { ScaleLinear } from 'd3';

interface ChartData {
  name: string;
  series: { name: number, value: number }[];
}

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.html',
  styleUrls: ['chart.css'],
})
export class ChartComponent {
  constructor(public trackService: TrackService,
    public layerService: LayerService) {
  }
}

@Component({
  selector: 'app-plottable',
  template: `
    <div
        id="plot"
        class="plottable">
    </div>
    <div><span>{{hoverPeak}}</span></div>`,
})
export class PlottablePlotComponent {
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

  @Input('hover-peak') set hoverPeak(peak: [number, number]) {
    console.log('Hovered peak No.', peak);
    if (peak == null) {
      this.hoverPeakDataSet.data([]);
    } else {
      this.hoverPeakDataSet.data([peak]);
    }
  }

  get hoverPeak(): [number, number] {
    if (this.hoverPeakDataSet.data.length === 0) {
      return [-1, -1];
    }
    return this.hoverPeakDataSet.data[0];
  }

  private origDataSet: Dataset;
  private compDataSet: Dataset;
  private rangeFlagsDataSet: Dataset;
  private hoverPeakDataSet: Dataset;

  private table: Table;
  private xScale: Scales.Linear;
  private yScale: Scales.Linear;


  constructor() {
    this.xScale = new Scales.Linear();
    this.yScale = new Scales.Linear().tickGenerator(
      Scales.TickGenerators.integerTickGenerator());
    const xAxis = new Axes.Numeric(this.xScale, 'bottom').tickLabelPadding(0);
    const yAxis = new Axes.Numeric(this.yScale, 'left');

    this.origDataSet = new Dataset();
    const origPlot = new Plots.Area().addDataset(this.origDataSet)
      .x((d) => +d.name, this.xScale)
      .y((d) => +d.value, this.yScale)
      .attr('fill', '#81d4fa')
      .attr('stroke', '#03a9f4');

    this.compDataSet = new Dataset();
    const compPlot = new Plots.Line().addDataset(this.compDataSet)
      .x((d) => +d.name, this.xScale)
      .y((d) => +d.value, this.yScale)
      .attr('stroke', '#ff5722');

    this.rangeFlagsDataSet = new Dataset();
    const rangePlot = new Plots.Rectangle().addDataset(this.rangeFlagsDataSet)
      .x((d) => d.be, this.xScale)
      .x2((d) => d.en)
      .y((_) => 0)
      .y2((_) => rangePlot.height())
      .attr('fill', '#b0bec5')
      .attr('stroke', '#78909c')
      .attr('opacity', 0.3);

    this.hoverPeakDataSet = new Dataset();
    const hoverPeakPlot = new Plots.Scatter().addDataset(this.hoverPeakDataSet)
      .x((d) => d[0], this.xScale)
      .y((d) => d[1], this.yScale)
      .size(30)
      .attr('fill', '#ff5722');

    const plots = new Components.Group([origPlot, compPlot, rangePlot, hoverPeakPlot]);
    this.table = new Components.Table([[yAxis, plots]]);

  }


  @HostListener('window:resize')
  onWindowResize() {
    this.table.redraw();
  }
}
