// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBrbaIJrMqiL1Ho_rM35FgieqOyAjF-BiE',
    authDomain: 'checkers-f4624.firebaseapp.com',
    databaseURL: 'https://checkers-f4624.firebaseio.com',
    projectId: 'checkers-f4624',
    storageBucket: 'checkers-f4624.appspot.com',
    messagingSenderId: '620605328425'
  }
};
