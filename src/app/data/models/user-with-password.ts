import { User } from './user';

export  class UserWithPassword extends User {
    password: string;

    constructor(id: number, email: string, password: string) {
        super(id, email, password);
        this.password = password;
    }
}
