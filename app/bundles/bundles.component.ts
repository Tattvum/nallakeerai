import { Component, Input, ViewChild, ElementRef, NgZone } from 'angular2/core';

import { DataService }   from '../data/data.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

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

  constructor(private service: DataService, private ngZone: NgZone) {
    this.service.getAll().then(all => {
      this.all = all;
    });
  }

  bundle(farm: string, plant: string) {
    if (this.all.bundles != null && this.all.bundles[farm] != null && this.all.bundles[farm][plant] != null)
      return this.all.bundles[farm][plant];
    else return "";
  }

  isSelected(farm: string, plant: string): boolean {
    return this.farm == farm && this.plant == plant;
  }

  isHighlighted(farm: string, plant: string): boolean {
    return this.farm == farm || this.plant == plant;
  }

  private focusEditor() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.editor.nativeElement.focus(), 0);
    });
  }

  editHarvest(farm: string, plant: string) {
    this.showEditor = true;
    this.farm = farm;
    this.plant = plant;
    this.quantity = 0;
    this.focusEditor();
  }

  onSubmit() {
    this.service.harvest(this.farm, this.plant, this.quantity);
    this.showEditor = false;
  }

  addFarm() {
    let code = prompt("Farm Code:");
    if (code != null) this.service.addFarm(code);
  }

  addPlant() {
    let code = prompt("Plant Code:");
    if (code != null) this.service.addPlant(code);
  }
}
