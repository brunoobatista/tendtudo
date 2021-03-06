import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastyService } from 'ng2-toasty';

import { NotAuthenticatedError } from './../seguranca/master-http';

@Injectable()
export class ErrorHandlerService {

  constructor(
     private router: Router,
     private toasty: ToastyService,
   ) {
   }

   handle(errorResponse: any) {
      let msg: string;
      if (typeof errorResponse === 'string') {
         msg = errorResponse;
      } else if (errorResponse instanceof NotAuthenticatedError) {
         msg = 'Sua sessão expirou!';
         this.router.navigate(['/login']);
      } else if (errorResponse instanceof HttpErrorResponse
         && errorResponse.status >= 400 && errorResponse.status <= 499) {
            if (errorResponse.status === 403) {
               msg = 'Você não tem permissão para executar esta ação!';
            } else if (errorResponse.status === 400) {
               msg = 'Usuário incorreto ou senha inválida';
            } else {
               msg = 'Ocorreu erro ao processar a sua solicitação.';
            }

            try {
               msg = errorResponse.error[0].mensagemUsuario;
            } catch (error) { }
      } else {
         msg = 'Erro ao processar serviço remoto. Tente novamente';
      }
      console.log('handler', errorResponse)
      this.toasty.error(msg);
      return msg;
   }

}
