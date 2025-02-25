import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Investor } from 'src/app/data/models/investor';
import {Roles} from "../../../constants/roles";
import {LocalStorageService} from "../../../services/local-storage.service";

@Component({
  selector: 'app-investor-page',
  templateUrl: './investor-page.component.html',
  styleUrls: ['./investor-page.component.scss']
})
export class InvestorPageComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute,
              readonly localStorageService: LocalStorageService,) {
  }

  investor?: Investor;

  ngOnInit(): void {
    this.route.data.subscribe(({ investor }) => {
      this.investor = investor;
    })
}

    protected readonly Roles = Roles;
}
