import {Pipe, PipeTransform} from '@angular/core';
import {User} from "../models/user";

@Pipe({
  name: 'usersFilter'
})

export class UsersFilterPipe implements PipeTransform {
  transform(users: User[], search: string = ''): User[] {
    if (!search.trim()) {
      return users;
    }
    return users.filter(user => {
      return `${user.name} ${user.surname}`.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });

  }
}
