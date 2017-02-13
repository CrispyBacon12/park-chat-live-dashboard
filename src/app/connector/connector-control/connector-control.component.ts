import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Image } from '../connector.module';

@Component({
  selector: 'connector-control',
  templateUrl: './connector-control.component.html',
  styleUrls: ['./connector-control.component.css'],
})
export class ConnectorControlComponent implements OnInit {
  streamKey: string;
  editing: boolean;

  @Input() image: Image;
  @Input() serviceName: string;
  @Output() onEditingChange = new EventEmitter<string>();

  constructor() { 
    this.editing = true;
  }

  ngOnInit() {
  }

  emitStreamKey() {
    this.onEditingChange.emit(this.streamKey);
  }

  startEditing() {
    this.editing = true;
  }

  stopEditing() {
    this.editing = false;
    this.emitStreamKey();
  }
}
