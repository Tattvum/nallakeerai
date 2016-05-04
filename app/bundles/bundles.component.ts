import { Component, Input, ViewChild, ElementRef, NgZone, Renderer } from 'angular2/core';

import { DataService, TimeMode }   from '../data/data.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

function log(msg: any, obj: any = "") {
  console.log(msg, obj);
}

@Component({
  moduleId: __moduleName,
  selector: 'bundles',
  templateUrl: 'bundles.component.html',
  styleUrls: ['bundles.component.css'],
})
export class BundlesComponent {
  private all;
  quantity: number = 0;
  private farm: string;
  private plant: string;
  showEditor: boolean = false;

  @ViewChild('editor') editor: ElementRef;

  constructor(private service: DataService, private ngZone: NgZone, private renderer: Renderer) {
    this.service.getAll().then(_all => {
      this.all = _all;
    });
  }

  bundle(farm: string, plant: string) {
    if (this.all.bundles != null && this.all.bundles[farm] != null && this.all.bundles[farm][plant] != null)
      return this.all.bundles[farm][plant];
    else return "";
  }

  isSelected(farm: string, plant: string): boolean {
    return this.isDay() && this.farm == farm && this.plant == plant;
  }

  isHighlighted(farm: string, plant: string): boolean {
    return this.isDay() && (this.farm == farm || this.plant == plant);
  }

  isDay(): boolean {
    return this.service.getTimeMode() == TimeMode.DAY;
  }

  timeMode(): string {
    return this.isDay() ? "Day Mode" : "Week mode";
  }

  private focusEditor() {
    //http://stackoverflow.com/questions/34502768/why-angular2-template-local-variables-are-not-usable-in-templates-when-using-ng
    //http://angularjs.blogspot.in/2016/04/5-rookie-mistakes-to-avoid-with-angular.html
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.renderer.invokeElementMethod(this.editor.nativeElement, 'focus', []);
      });
    });
  }

  escape(event) {
    if (event.keyCode &&event.keyCode == 27) this.close();
  }

  close() {
    this.showEditor = false;
  }

  editHarvest(farm: string, plant: string) {
    this.showEditor = this.isDay();
    if (!this.showEditor) return;
    this.farm = farm;
    this.plant = plant;
    this.quantity = null;
    this.focusEditor();
  }

  onSubmit() {
    this.service.addHarvest(this.farm, this.plant, this.quantity);
    this.showEditor = false;
  }

  addFarm() {
    if(!this.isDay()) return;
    let code = prompt("Farm Code:");
    if (code == null || code.trim() == "") return;
     
    //HACK: why is this required after switching TimeMode?
    this.service.addFarm(code).then(()=>{
      return this.service.getAll().then(_all=>{
        this.all = _all;
      });
    });
  }

  addPlant() {
    if(!this.isDay()) return;
    let code = prompt("Plant Code:");
    if (code == null || code.trim() == "") return;

    //HACK: why is this required after switching TimeMode?
    this.service.addPlant(code).then(()=>{
      return this.service.getAll().then(_all=>{
        this.all = _all;
      });
    });
  }
}
