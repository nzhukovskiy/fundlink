import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../services/local-storage.service";
import {Roles} from "../../../constants/roles";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  constructor(private readonly localStorageService: LocalStorageService) {
  }

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
