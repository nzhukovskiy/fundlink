import { Directive, Input, OnDestroy } from '@angular/core';
import { Notification } from '../../../data/models/notification';
import { Subject } from 'rxjs';

@Directive()
export abstract class NotificationBase implements OnDestroy {
    @Input() notification?: Notification;
    protected destroy$= new Subject<void>();

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
