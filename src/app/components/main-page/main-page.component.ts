import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/constants/roles';
import { InvestorsService } from 'src/app/services/investors.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  constructor(private readonly localStorageService: LocalStorageService,
    private readonly investorsService: InvestorsService) {}

  role?: Roles;

  ngOnInit(): void {
    let user = this.localStorageService.getUser();
    console.log(user)
    if (user?.payload.role) {
      this.role = user.payload.role;
    }
  }

  protected readonly Roles = Roles;
}
