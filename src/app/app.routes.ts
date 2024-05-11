import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MiddlebarComponent } from './middlebar/middlebar.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path:"",
        component:AppComponent
    },
    {
        path:"nav-bar",
        component:NavbarComponent
    },
    {
        path:"middlebar",
        component:MiddlebarComponent
    },
    {
        path:"home",
        component:HomeComponent
    }
];
