// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  curveApi: 'http://localhost:3000/curves/',
  facApi: 'http://localhost:3000/faciales/',
  curves: ["BAAA2", "BAAA3", "BAAA12", "CEC", "CECUVR"],
  colors: ['#3e3f4d', '#a142f4', '#54a47e', '#e08741', '#c15696', '#3d8fb3', '#bfab3f', '#a94040', '#689ca7', '#d36d6d']
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
