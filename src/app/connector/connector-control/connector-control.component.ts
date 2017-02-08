import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() onEditingChange = new EventEmitter<boolean>();

  constructor() { 
    this.editing = false;
  }

  ngOnInit() {
  }

  emitEditingChange() {
    this.onEditingChange.emit(this.editing);
  }

  startEditing() {
    this.editing = true;
    this.emitEditingChange();
  }

  stopEditing() {
    this.editing = false;
    this.emitEditingChange();
  }
}
