import { Injectable } from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {FundingRound} from "../data/models/funding-round";
import {CreateFundingRoundDto} from "../data/dtos/create-funding-round.dto";
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundingRoundsService {

  constructor(private readonly appHttpService: AppHttpService) { }

  getOne(id: number) {
    return this.appHttpService.get<FundingRound>(`funding_rounds/${id}`).pipe(
      map((apiResponse) => {
        return plainToInstance(FundingRound, apiResponse) as unknown as FundingRound
      })
    );
  }

  create(createFundingRoundDto: CreateFundingRoundDto) {
    return this.appHttpService.post<FundingRound>(`startups/funding_rounds/`, instanceToPlain(createFundingRoundDto));
  }

  update(id: number, updateFundingRoundDto: CreateFundingRoundDto) {
    return this.appHttpService.put<FundingRound>(`funding_rounds/${id}`, instanceToPlain(updateFundingRoundDto));
  }

  delete(id: number) {
    return this.appHttpService.delete(`funding_rounds/${id}`);
  }
}
