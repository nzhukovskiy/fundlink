import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../../../data/models/tag';
import { TagService } from '../../../services/tag.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss']
})
export class TagsListComponent implements OnInit {

    constructor(private readonly tagService: TagService) {
    }

    @Input()
    editAllowed = false;

    @Input()
    tags: Tag[] = [];

    @Output()
    tagRemoveEvent = new EventEmitter<number>();

    @Output()
    tagAddEvent = new EventEmitter<number>();

    allTags: Tag[] = [];

    removeTag(tagId: number) {
        this.tagRemoveEvent.emit(tagId);
    }

    addTag(tagId: number) {
        this.tagAddEvent.emit(tagId);
    }

    ngOnInit(): void {
        if (this.editAllowed) {
            this.tagService.getAllTags().subscribe(res => this.allTags = res);
        }
    }
}
