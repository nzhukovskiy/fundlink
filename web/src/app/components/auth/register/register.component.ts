import { Component } from '@angular/core';
import {FormType} from "../../../constants/form-type";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor() {
  }

  protected readonly FormType = FormType;
}
