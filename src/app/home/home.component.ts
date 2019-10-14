import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ParentService } from '../gfx/abstract/parent.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute,
              public parentService: ParentService) { }

  ngOnInit() {
  }

}
