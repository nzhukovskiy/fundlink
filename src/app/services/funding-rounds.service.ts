import { Injectable } from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {FundingRound} from "../data/models/funding-round";
import {CreateFundingRoundDto} from "../data/dtos/create-funding-round.dto";

@Injectable({
  providedIn: 'root'
})
export class FundingRoundsService {

  constructor(private readonly appHttpService: AppHttpService) { }

  getOne(id: number) {
    return this.appHttpService.get<FundingRound>(`funding-rounds/${id}`);
  }

  create(createFundingRoundDto: CreateFundingRoundDto) {
    return this.appHttpService.post<FundingRound>(`startups/funding-rounds/`, createFundingRoundDto);
  }

  update(id: number, updateFundingRoundDto: CreateFundingRoundDto) {
    return this.appHttpService.put<FundingRound>(`funding-rounds/${id}`, updateFundingRoundDto);
  }

  delete(id: number) {
    return this.appHttpService.delete(`funding-rounds/${id}`);
  }
}
