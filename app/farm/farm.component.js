System.register(['angular2/core', 'angular2/router', '../things/things.plain.component', '../bundles/bundles.component'], function(exports_1, context_1) {
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
    var core_1, router_1, things_plain_component_1, bundles_component_1;
    var BlankComponent, FarmComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (things_plain_component_1_1) {
                things_plain_component_1 = things_plain_component_1_1;
            },
            function (bundles_component_1_1) {
                bundles_component_1 = bundles_component_1_1;
            }],
        execute: function() {
            BlankComponent = (function () {
                function BlankComponent() {
                }
                BlankComponent = __decorate([
                    core_1.Component({ template: '' }), 
                    __metadata('design:paramtypes', [])
                ], BlankComponent);
                return BlankComponent;
            }());
            exports_1("BlankComponent", BlankComponent); // one-line component!
            FarmComponent = (function () {
                function FarmComponent(router, routeParams) {
                    this.router = router;
                    this.routeParams = routeParams;
                    this.path = routeParams.get('path');
                }
                FarmComponent.prototype.click = function (where) {
                    console.log(where + " " + this.path);
                    if (where == "plants")
                        this.router.navigate(['./Plants', { path: this.path }]);
                    else if (where == "things")
                        this.router.navigate(['./Things', { path: this.path }]);
                    else
                        this.router.navigate(['./Beds']);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FarmComponent.prototype, "farm", void 0);
                FarmComponent = __decorate([
                    // one-line component!
                    core_1.Component({
                        moduleId: __moduleName,
                        selector: 'farm',
                        templateUrl: 'farm.component.html',
                        styleUrls: ['farm.component.css'],
                        directives: [router_1.ROUTER_DIRECTIVES],
                    }),
                    router_1.RouteConfig([
                        { path: '/', name: 'Blank', component: BlankComponent, useAsDefault: true },
                        { path: '/plants', name: 'Plants', component: things_plain_component_1.ThingsPlainComponent },
                        { path: '/beds', name: 'Beds', component: bundles_component_1.BundlesComponent },
                    ]), 
                    __metadata('design:paramtypes', [router_1.Router, router_1.RouteParams])
                ], FarmComponent);
                return FarmComponent;
            }());
            exports_1("FarmComponent", FarmComponent);
        }
    }
});
//# sourceMappingURL=farm.component.js.map