System.register(['angular2/core', 'angular2/router', '../things/things.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, things_service_1;
    var HarvestFormComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (things_service_1_1) {
                things_service_1 = things_service_1_1;
            }],
        execute: function() {
            HarvestFormComponent = (function () {
                function HarvestFormComponent(service, routeParams) {
                    this.service = service;
                    this.routeParams = routeParams;
                    this.harvest = { day: "---", farm: "---", plant: "---", quantity: 0 };
                    this.submitted = true;
                    var parts = routeParams.get('path').split("/");
                    var fid = 2;
                    var pid = 3;
                    if (parts[1] == 'Plants') {
                        fid = 3;
                        pid = 2;
                    }
                    this.harvest.farm = parts[fid];
                    this.harvest.plant = parts[pid];
                    this.harvest.quantity = 0;
                    this.harvest.day = service.getDay();
                }
                HarvestFormComponent.prototype.onSubmit = function () {
                    this.submitted = true;
                    console.log(this.harvest);
                    this.service.addHarvest({
                        day: this.harvest.day,
                        farm: +this.harvest.farm.split(":")[1] - 1,
                        plant: +this.harvest.plant.split(":")[1] - 1,
                        quantity: this.harvest.quantity,
                    });
                };
                HarvestFormComponent = __decorate([
                    core_1.Component({
                        moduleId: __moduleName,
                        selector: 'harvest-form',
                        templateUrl: 'harvest.form.component.html',
                        styleUrls: ['harvest.form.component.css'],
                    }), 
                    __metadata('design:paramtypes', [things_service_1.ThingsService, router_1.RouteParams])
                ], HarvestFormComponent);
                return HarvestFormComponent;
            }());
            exports_1("HarvestFormComponent", HarvestFormComponent);
        }
    }
});
//# sourceMappingURL=harvest.form.component.js.map