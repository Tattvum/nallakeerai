import { bootstrap }    from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app.component';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';

//IMPORTANT TBD 2/5 - required for dev testing? uncomment in production!
//enableProdMode();

bootstrap(AppComponent, [HTTP_PROVIDERS, ROUTER_PROVIDERS]);
