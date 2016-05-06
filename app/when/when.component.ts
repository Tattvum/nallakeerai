import { Component, Input, Output } from '@angular/core';
import { DataService }    from '../data/data.service';

// Let TypeScript know about the special SystemJS __moduleName variable
//declare var __moduleName: string;

@Component({
//  moduleId: __moduleName,
  selector: 'when',
  templateUrl: 'app/when/when.component.html',
  styleUrls: ['app/when/when.component.css'],
})
export class WhenComponent {

  isProcessing: boolean = false;

  showDay() {//wow, a nice way to listen to variable changes - use gui
    return this.service.showWhen();
  }

  constructor(private service: DataService) {}

  clickPrev(event) {
    this.isProcessing= true;
    this.service.prev()
      .then(()=>{this.isProcessing= false})
      .catch(()=>{this.isProcessing= false});
  }

  clickNow(event) {
    this.isProcessing= true;
    this.service.toggleDayWeek()
      .then(()=>{this.isProcessing= false})
      .catch(()=>{this.isProcessing= false});
  }

  clickNext(event) {
    this.isProcessing= true;
    this.service.next()
      .then(()=>{this.isProcessing= false})
      .catch(()=>{this.isProcessing= false});
  }

}
