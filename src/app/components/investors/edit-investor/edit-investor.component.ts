import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorsService } from 'src/app/services/investors.service';

@Component({
  selector: 'app-edit-investor',
  templateUrl: './edit-investor.component.html',
  styleUrls: ['./edit-investor.component.scss']
})
export class EditInvestorComponent implements OnInit {

  constructor(private readonly investorsService: InvestorsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = parseInt(params.get("id")!);
      this.investorsService.getOne(id).subscribe(res => {
        this.investorUpdateFormGroup.setValue({
          name: res.name,
          surname: res.surname
        })
      })
    })
  }

  investorUpdateFormGroup = new FormGroup({
    name: new FormControl<string>("", ),
    surname: new FormControl<string>("", )
  })

  updateInvestor() {
    this.investorsService.update({
      name: this.investorUpdateFormGroup.controls.name.getRawValue()!,
      surname: this.investorUpdateFormGroup.controls.surname.getRawValue()!,
    }).subscribe(res => {
      this.router.navigate(['/profile']).then();
    })
  }
}
