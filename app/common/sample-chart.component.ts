import { Component} from 'angular2/core';
import { GoogleChartComponent} from './google-chart.component';

@Component({
  selector: 'sampchart',
  template: `
    <div class="four wide column center aligned">
        <div id="chart_div" style="width: 900px; height: 500px;"></div>
    </div>
  `
})
export class SampleChartComponent extends GoogleChartComponent {
  private options;
  private data;
  private chart;

  constructor() {
    super();
    console.log("Here is SampleChartComponent")
  }

  drawGraph(){
    console.log("DrawGraph Evolution...");  
    this.data = this.createDataTable([
      ['Evolution', 'Imports', 'Exports'],
      ['A', 8695000, 6422800],
      ['B', 3792000, 3694000],
      ['C', 8175000, 800800]
    ]);

    this.options = {
      title: 'Evolution, 2014',
      chartArea: {width: '50%'},
      hAxis: {
        title: 'Value in USD',
        minValue: 0
      },
      vAxis: {
        title: 'Members'
      }
    };

    this.chart = this.createBarChart(document.getElementById('chart_div'));
    this.chart.draw(this.data, this.options);
  }
}
