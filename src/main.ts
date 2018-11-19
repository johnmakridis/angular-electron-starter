import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import 'hammerjs';

if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => console.error(err));


// platformBrowserDynamic().bootstrapModule(AppModule)
//   .then(() => {
//     if (environment.production) {
//       if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.register('worker-basic.min.js');
//       }
//     }
//   })
//   .catch(err => console.error(err));
