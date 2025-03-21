import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/constants/roles';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    constructor(private readonly localStorageService: LocalStorageService) {
    }

    role?: Roles;

    ngOnInit(): void {
        let user = this.localStorageService.getUser();
        if (user?.role) {
            this.role = user.role;
        }
    }

    protected readonly Roles = Roles;
}
