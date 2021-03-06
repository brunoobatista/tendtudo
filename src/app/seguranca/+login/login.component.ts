import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  show = false;
  msg;
  constructor(
      private auth: AuthService,
      private router: Router,
      private errorHandler: ErrorHandlerService,
  ) {
    /*if (this.auth.jwtPayload) {
      this.router.navigate(['/']);
    }*/
  }

  ngOnInit() {
  }

  login(username: string, password: string) {
    this.auth.login(username, password)
       .then(() => {
          this.router.navigate(['/']);
       })
       .catch(error => {
          this.msg = this.errorHandler.handle(error);
          this.show = true;
          setTimeout(() => {
            this.show = false;
          }, 4000);
       });
}

}
