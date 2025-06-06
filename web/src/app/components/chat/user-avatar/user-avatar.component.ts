import { Component, Input } from '@angular/core';
import { Roles } from '../../../constants/roles';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {

    constructor(readonly localStorageService: LocalStorageService) {
    }

    @Input() avatarStyle?: "image" | "initials";
    @Input() imagePath?: string;
    @Input() fullName?: {
        name: string;
        surname: string;
    };
    protected readonly Roles = Roles;
}
