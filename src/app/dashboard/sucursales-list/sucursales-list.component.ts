import { Component, OnInit, Input } from '@angular/core';

import { UserProfile } from '../../models/userprofile';

@Component({
  selector: 'app-sucursales-list',
  templateUrl: './sucursales-list.component.html',
  styleUrls: ['./sucursales-list.component.scss']
})
export class SucursalesListComponent implements OnInit {

  @Input() sucursales: UserProfile[];
  @Input() colors: string[];

  constructor() { }

  ngOnInit() {
  }

}
