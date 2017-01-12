import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class DashboardNavbarComponent implements OnInit {

  @HostBinding('class.mdl-layout__drawer') isDrawer = true;
  @HostBinding('class.mdl-color--primary-dark') isColored = true;
  constructor() { }

  ngOnInit() {
  }

}
