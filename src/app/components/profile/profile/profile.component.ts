import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Roles } from '../../../constants/roles';
import { Router } from '@angular/router';
import { UserService } from '../../../services/users/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    constructor(private readonly localStorageService: LocalStorageService,
                private readonly userService: UserService,
                private readonly router: Router) {
    }

    role?: Roles;

    ngOnInit(): void {
        let user = this.localStorageService.getUser();
        console.log(user);
        if (user?.role) {
            this.role = user.role;
        }
    }

    protected readonly Roles = Roles;

    logout() {
        this.userService.clearUser();
        this.router.navigate(['/login']).then();
    }
}
