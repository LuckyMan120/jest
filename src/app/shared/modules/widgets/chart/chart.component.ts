import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() data: any;
  @Input() options!: ChartOptions;
  @Input() plugins!: any;
  @Input() type: 'doughnut' | 'bar' = 'bar';

  @ViewChild('chart', { static: true }) chartElement!: ElementRef<HTMLCanvasElement>;

  public defaultOptions: Chart.ChartOptions = {
    responsive: true,
    legend: {
      display: true
    },
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  constructor() {
  }

  ngOnInit(): Chart {
    const options = Object.assign(this.defaultOptions, this.options);
    const config: Chart.ChartConfiguration = { type: this.type, data: this.data, options, plugins: this.plugins };
    return new Chart(this.chartElement.nativeElement, config);
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
