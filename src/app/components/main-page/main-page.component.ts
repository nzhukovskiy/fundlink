import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/constants/roles';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {UserService} from "../../services/users/user.service";

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(protected readonly userService: UserService) {
    }


    protected readonly Roles = Roles;
}
