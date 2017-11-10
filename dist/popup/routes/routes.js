"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_component_1 = require("../components/home/home.component");
const settings_component_1 = require("../components/settings/settings.component");
exports.routes = [
    { path: "home", component: home_component_1.HomeComponent },
    { path: "settings", component: settings_component_1.SettingsComponent },
    { path: "**", redirectTo: "/home" }
];
//# sourceMappingURL=routes.js.map