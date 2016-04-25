System.register(['angular2/core', '../data/data.service'], function(exports_1, context_1) {
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
    var core_1, data_service_1;
    var HarvestFormComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (data_service_1_1) {
                data_service_1 = data_service_1_1;
            }],
        execute: function() {
            HarvestFormComponent = (function () {
                function HarvestFormComponent(service) {
                    this.service = service;
                    this.submitted = true;
                    this.quantity = 0;
                }
                HarvestFormComponent.prototype.onSubmit = function () {
                    this.submitted = true;
                    this.service.harvest(this.quantity);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], HarvestFormComponent.prototype, "submitted", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], HarvestFormComponent.prototype, "quantity", void 0);
                HarvestFormComponent = __decorate([
                    core_1.Component({
                        moduleId: __moduleName,
                        selector: 'harvest-form',
                        templateUrl: 'harvest.form.component.html',
                        styleUrls: ['harvest.form.component.css'],
                    }), 
                    __metadata('design:paramtypes', [data_service_1.DataService])
                ], HarvestFormComponent);
                return HarvestFormComponent;
            }());
            exports_1("HarvestFormComponent", HarvestFormComponent);
        }
    }
});
//# sourceMappingURL=harvest.form.component.js.map