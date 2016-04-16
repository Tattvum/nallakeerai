System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Harvest;
    return {
        setters:[],
        execute: function() {
            Harvest = (function () {
                function Harvest(id, date, farm, plant, quantity, comment) {
                    this.id = id;
                    this.date = date;
                    this.farm = farm;
                    this.plant = plant;
                    this.quantity = quantity;
                    this.comment = comment;
                }
                return Harvest;
            }());
            exports_1("Harvest", Harvest);
        }
    }
});
//# sourceMappingURL=harvest.js.map