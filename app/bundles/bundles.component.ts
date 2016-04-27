import { Component, Input, ViewChild, ElementRef } from 'angular2/core';

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

  constructor(private service: DataService) {
    this.service.getAll().then(all => {
      this.all = all;
    });
  }

  bundle(farm: string, plant: string) {
    if(this.all.bundles != null && this.all.bundles[farm] != null && this.all.bundles[farm][plant] != null)
      return this.all.bundles[farm][plant];
    else return "";
  }

  isSelected(farm: string, plant: string): boolean {
    return this.farm == farm && this.plant == plant;
  }

  isHighlighted(farm: string, plant: string): boolean {
    return this.farm == farm || this.plant == plant;
  }

  editHarvest(farm: string, plant: string) {
    this.showEditor = true;
    this.farm = farm;
    this.plant = plant;
    this.quantity = this.all.bundles[farm][plant];
    //this.editor.nativeElement.focus();
  }

  onSubmit() {
    this.service.harvest(this.farm, this.plant, this.quantity);
    this.showEditor = false;
  }

  addFarm() {
    let code = prompt("Farm Code:");
    this.service.addFarm(code);
  }

  addPlant() {
    let code = prompt("Plant Code:");
    this.service.addPlant(code);
  }
}
