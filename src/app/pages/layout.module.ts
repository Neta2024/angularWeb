import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { LayoutComponent } from './layout/layout/layout.component';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { NavLeftComponent } from './layout/nav-bar/nav-left/nav-left.component';
import { NavLogoComponent } from './layout/nav-bar/nav-logo/nav-logo.component';
import { NavRightComponent } from './layout/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './layout/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './layout/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './layout/navigation/nav-content/nav-item/nav-item.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { NavCollapseComponent } from './layout/navigation/nav-content/nav-collapse/nav-collapse.component';


@NgModule({
  declarations: [
    LayoutComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavItemComponent,
    NavCollapseComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ],
})
export class LayoutModule { }
