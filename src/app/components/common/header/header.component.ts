import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Roles } from '../../../constants/roles';
import { UserJwtInfo } from '../../../data/models/user-jwt-info';
import { investorResolver } from '../../../resolvers/investor.resolver';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(readonly localStorageService: LocalStorageService) {}

    currentUser?: UserJwtInfo;
    protected readonly Roles = Roles;

    ngOnInit(): void {
        this.currentUser = this.localStorageService.getUser();
    }

    protected readonly investorResolver = investorResolver;
    protected readonly isSecureContext = isSecureContext;
}
