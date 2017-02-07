import { Component, OnInit, Input } from '@angular/core';
import { Image } from '../connector.module';

@Component({
  selector: 'connector-control',
  templateUrl: './connector-control.component.html',
  styleUrls: ['./connector-control.component.css'],
})
export class ConnectorControlComponent implements OnInit {
  streamKey: string | null;
  editing: boolean;

  @Input() image: Image;

  constructor() { 
    this.editing = false;
  }

  ngOnInit() {
  }

  toggleEditing() {
    this.editing = !this.editing;
  }
}
