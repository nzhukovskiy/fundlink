import {ResolveFn} from '@angular/router';
import {ChatService} from "../services/chat.service";
import {Chat} from "../data/models/chat";
import {genericResolver} from "./generic.resolver";

export const chatResolver: ResolveFn<Chat> =
    genericResolver(
        ChatService,
        (service, id) => service.getChat(id))
// (route, state) => {
//   const chatService = inject(ChatService);
//   const router = inject(Router);
//   const id = route.paramMap.get('id');
//   return chatService.getChat(parseInt(id!)).pipe(
//     catchError(error => {
//       router.navigate(['**'], {skipLocationChange: true}).then();
//       return EMPTY;
//     })
//   );
// };
