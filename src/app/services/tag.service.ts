import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Tag } from '../data/models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private readonly appHttpService: AppHttpService) { }

  getAllTags() {
    return this.appHttpService.get<Tag[]>(`tags`);
  }
}
