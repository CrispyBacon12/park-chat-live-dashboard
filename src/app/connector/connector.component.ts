import { Component, OnInit } from '@angular/core';
import { Image } from './connector.module';

@Component({
  selector: 'connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.css']
})
export class ConnectorComponent implements OnInit {
  youtubeLogo: Image;
  facebookLogo: Image;

  constructor() {
    this.youtubeLogo = {
      alt: 'YouTube',
      src: '/assets/YouTube-logo-full_color.png',
      size: {
        height: 249,
        width: 400
      }
    };

    this.facebookLogo = {
      alt: 'Facebook',
      src: '/assets/FB-f-Logo__blue_144.png',
      size: {
        height: 144,
        width: 144
      }
    };
  }

  ngOnInit() {
  }

}
