import { Component, OnInit } from '@angular/core';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../../data/models/tag';
import { TagService } from '../../../services/tag.service';

@Component({
    selector: 'app-all-startups',
    templateUrl: './all-startups.component.html',
    styleUrls: ['./all-startups.component.scss'],
})
export class AllStartupsComponent implements OnInit {
    constructor(private readonly startupService: StartupService,
                private readonly tagService: TagService,
                private readonly router: Router,
                private readonly route: ActivatedRoute) {

    }

    totalStartupsNumber: number = 0;
    pageSize = 8;
    pageIndex = 0;
    startups: Startup[] = [];
    tag?: string;
    isInteresting = false;
    allTags: Tag[] = [];
    selectOptions: { identifier: string, text: string }[] = [];

    startupTitleSearch = new FormControl('');
    onlyActive = new FormControl(false);
    includeExited = new FormControl(false);

    ngOnInit(): void {

        this.tagService.getAllTags().subscribe(tags => {
            this.allTags = tags;
            this.selectOptions = this.allTags.map(x => {
                return {
                    identifier: x.title,
                    text: x.title
                }
            })
        });
        this.route.queryParams.subscribe(params => {
            this.startupTitleSearch.setValue(params['title'], { emitEvent: false });
            this.tag = params['tag'];
            this.isInteresting = params['isInteresting'];
            this.onlyActive.setValue(params['onlyActive']);
            this.includeExited.setValue(params['includeExited']);
            this.startupService.getAll(this.pageIndex + 1, this.pageSize, params['title'], params['tag'], params['isInteresting'], params["onlyActive"], params['includeExited']).subscribe(res => {
                this.startups = res.data;
                this.totalStartupsNumber = res.meta.totalItems;
            });
        });
        this.startupTitleSearch.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(searchPattern => {
                this.router.navigate([], {
                    queryParams: {
                        title: searchPattern || null,
                    },
                    queryParamsHandling: 'merge',
                }).then();
            });

        this.onlyActive.valueChanges.subscribe(res => {
            this.router.navigate([], {
                queryParams: {
                    onlyActive: res || null,
                },
                queryParamsHandling: 'merge',
            }).then();
        })

        this.includeExited.valueChanges.subscribe(res => {
            this.router.navigate([], {
                queryParams: {
                    includeExited: res || null,
                },
                queryParamsHandling: 'merge',
            }).then();
        })
    }

    handlePageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.startupService.getAll(event.pageIndex + 1, event.pageSize, this.startupTitleSearch.getRawValue()!, this.tag, this.isInteresting).subscribe(res => {
            this.startups = res.data;
            this.totalStartupsNumber = res.meta.totalItems;
        });
    }

    handleTagChange(tag: string) {
        this.router.navigate([], {
            queryParams: {
                tag: tag || null,
            },
            queryParamsHandling: 'merge',
        }).then();
    }

    private navigateAndMergeParamsSub = (res: boolean) => {
        this.router.navigate([], {
            queryParams: {
                onlyActive: res || null,
            },
            queryParamsHandling: 'merge',
        }).then();
    }
}
