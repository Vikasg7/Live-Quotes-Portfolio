import { Routes } from "@angular/router"
import { HomeComponent } from "../components/home/home.component";
import { SettingsComponent } from "../components/settings/settings.component";

export const routes: Routes = [
   { path: "home", component: HomeComponent },
   { path: "settings", component: SettingsComponent },
   { path: "**", redirectTo: "/home" }
]