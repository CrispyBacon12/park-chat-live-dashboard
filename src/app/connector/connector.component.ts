import { Component, OnInit } from '@angular/core';
import { Image } from './connector.module';

import { FacebookService } from './facebook.service';

@Component({
  selector: 'connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.css']
})
export class ConnectorComponent implements OnInit {
  youtubeLogo: Image;
  facebookLogo: Image;
  
  constructor(private facebookService: FacebookService) {
    this.facebookService = facebookService;

    console.log("Hello", this.facebookService);
  }

  ngOnInit() {
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

  onFacebookEdit(editing: boolean) {
    if (editing) {
      // must now login
      this.facebookService.getVideoList()
      .then((what) => {
        console.log(what);
      });
    }
  }

}
