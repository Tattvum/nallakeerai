import { Component, Input, Output } from '@angular/core';
import { DataService }    from '../data/data.service';

//Let TypeScript know about the special CommonJS module.id variable
declare var module: {id: string};

@Component({
  moduleId: module.id,
  selector: 'when',
  templateUrl: 'when.component.html',
  styleUrls: ['when.component.css'],
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
