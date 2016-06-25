import { Component } from 'angular2/core';
import { SampleChartComponent } from './sample-chart.component';

@Component({
  selector: 'app',
  directives: [SampleChartComponent],
  template: `
      Hola Dude.
      <sampchart></sampchart>
      ting.
  `
})
export class DummyComponent {

}
