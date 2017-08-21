import { Component, OnInit, HostBinding } from '@angular/core'

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @HostBinding('class.mdl-layout__drawer') isDrawer = true
  @HostBinding('class.mdl-color--primary') isColored = false
  constructor() {}

  ngOnInit() {}

  disabledLink(event) {
    event.preventDefault()
  }
}
