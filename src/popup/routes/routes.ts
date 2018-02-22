import { Routes } from "@angular/router";
import { Home } from "../components/home";
import { Settings } from "../components/settings";

export const routes: Routes = [
   { path: "home", component: Home },
   { path: "settings", component: Settings },
   { path: "**", component: Home },
   { path: "", component: Home }
]