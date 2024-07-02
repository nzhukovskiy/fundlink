import {Roles} from "../../constants/roles";

export interface UserJwtInfo {
  payload: {
    "id": number,
    "email": string,
    "role": Roles
  }
}
