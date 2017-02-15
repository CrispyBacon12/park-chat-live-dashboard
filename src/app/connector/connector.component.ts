import { Component, OnInit } from '@angular/core';
import { Image } from './connector.module';

import { FacebookService, Comment } from './facebook/facebook.service';

@Component({
  selector: 'connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.css']
})
export class ConnectorComponent implements OnInit {
  youtubeLogo: Image;
  facebookLogo: Image;
  comments: Comment[];
  
  constructor(private facebookService: FacebookService) {
    this.facebookService = facebookService;
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

    this.comments = [];
  }

  onFacebookStreamKeyChange(streamKey: string) {
    if (streamKey) {
      console.log("Stream key is");
      // must now login
      this.facebookService.getVideoComments(streamKey)
      .then((response) => {
        return response.comments.data;
      })
      .then((data) => {
        this.comments = [...this.comments, ...data];
        console.log(this.comments);
      });
    }
  }

}
