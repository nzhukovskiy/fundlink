import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Message } from '../../../data/models/message';
import { Roles } from '../../../constants/roles';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements AfterViewInit, OnDestroy {
    constructor(readonly localStorageService: LocalStorageService) {
    }

    @Input() message?: Message;
    @Input() isLastMessage = false;
    @Output() markAsReadEvent = new EventEmitter<number>();
    @ViewChild('messageElement') messageElement!: ElementRef;
    observer!: IntersectionObserver;
    timeoutId: any;
    protected readonly Roles = Roles;

    ngAfterViewInit(): void {
        this.observer = new IntersectionObserver(
            (entries: any[]) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        this.timeoutId = setTimeout(() => {
                            if (this.message?.senderType !== this.localStorageService.getUser()?.role && !this.message?.readAt) {
                                this.markAsReadEvent.emit(this.message!.id);
                            }
                        }, 500);
                    } else {
                        clearTimeout(this.timeoutId);
                    }
                });
            },
            { threshold: [0.5] }
        );

        if (this.messageElement && this.messageElement.nativeElement && !this.message?.readAt) {
            this.observer.observe(this.messageElement.nativeElement);
        }
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
    }
}
