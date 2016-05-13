import { Component, Input, Output } from '@angular/core';
import { DataService, TimeMode }    from '../data/data.service';

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

  private clickTimeMode(tm: TimeMode) {
    this.isProcessing= true;
    this.service.setTimeMode(tm)
      .then(()=>{this.isProcessing= false})
      .catch(()=>{this.isProcessing= false});
  }

  clickDAY() { this.clickTimeMode(TimeMode.DAY) }
  clickWEEK() { this.clickTimeMode(TimeMode.WEEK) }
  clickMONTH() { this.clickTimeMode(TimeMode.MONTH) }

  clickNext(event) {
    this.isProcessing= true;
    this.service.next()
      .then(()=>{this.isProcessing= false})
      .catch(()=>{this.isProcessing= false});
  }

}
