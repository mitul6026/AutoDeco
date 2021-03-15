import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/AuthGuard';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { DashboardComponent } from './home/dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { AddjobworkComponent } from './home/addjobwork/addjobwork.component';
// import { ViewJobworkComponent } from './home/view-jobwork/view-jobwork.component';
import { AdditemComponent } from './home/additem/additem.component';
import { ViewitemComponent } from './home/viewitem/viewitem.component';
import { InspectionDashboardComponent } from './inspection-dashboard/inspection-dashboard.component';
import { CompanyDropdownComponent } from './utilities/company-dropdown/company-dropdown.component';
import { QualityCalenderComponent } from './qualitycalendar/qualitycalendar';
import { ViewjobworkModule } from './home/view-jobwork/viewjobwork.module';

const routes: Routes = [
    { path: "", component:HomeComponent,canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'xyz', component: DashboardComponent,canActivate: [AuthGuard]  },
  // { path: 'jobWorkMaterial', component: ViewJobworkComponent,canActivate: [AuthGuard]  },
  { path: 'addjobwork', component: AddjobworkComponent,canActivate: [AuthGuard]  },
  { path: 'jobWorkMaterial', loadChildren : './home/view-jobwork/viewjobwork.module#ViewjobworkModule',canActivate: [AuthGuard]  },

  { path: 'compdropdown', component: CompanyDropdownComponent,canActivate: [AuthGuard]  },
  { path: 'dashboard', component: InspectionDashboardComponent,canActivate: [AuthGuard]  },
  { path: 'additem', component: AdditemComponent,canActivate: [AuthGuard]  },
  { path: 'itemmsts', component: ViewitemComponent,canActivate: [AuthGuard]  },
  { path: 'companydropdown', component: CompanyDropdownComponent,canActivate: [AuthGuard]  },
  { path: 'calendar', component :QualityCalenderComponent,canActivate: [AuthGuard]  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
