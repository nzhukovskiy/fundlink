import {Roles} from "../../constants/roles";

export interface UserJwtInfo {
  "id": number,
  "email": string,
  "role": Roles
}
