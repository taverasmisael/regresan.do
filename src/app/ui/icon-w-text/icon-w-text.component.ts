import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon-w-text',
  templateUrl: './icon-w-text.component.html',
  styleUrls: ['./icon-w-text.component.scss']
})
export class IconWTextComponent implements OnInit {

  @Input() icon: string;
  @Input() text: string;
  @Input() color: string;
  constructor() { }

  ngOnInit() {
  }

}
