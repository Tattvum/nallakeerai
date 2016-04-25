import { Component, Input } from 'angular2/core';

import { Thing }   from '../data/thing';
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

  constructor(private service: DataService) {
    this.service.getAll().then(all => {
      this.all = all;
    });   
  }
  
  private farm: number;
  private plant: number;
  
  isSelected(farm: number, plant: number) {
    return this.farm == farm && this.plant == plant;
  }

  isHighlighted(farm: number, plant: number) {
    return this.farm == farm || this.plant == plant;
  }

  editHarvest(farm: number, plant: number, harvestForm) {
    this.farm = farm;
    this.plant = plant;
    this.quantity = this.all.bundles[farm][plant];
  }

  onSubmit() {
    this.service.harvestNew(this.farm, this.plant, this.quantity);
  }

}
