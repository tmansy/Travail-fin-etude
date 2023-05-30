// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
// import { OAuthService } from 'angular-oauth2-oidc';

// export class SSOGuard implements CanActivate {

//     constructor(private router: Router, private oauthService: OAuthService) {}

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
//         let hasAccessToken = this.oauthService.hasValidAccessToken();

//         return new Promise((resolve) => {
//             if(hasAccessToken) {
//                 resolve(true);
//             }
//             else {
//                 this.router.navigateByUrl('');
//                 resolve(false);
//             }
//         })
//     }
// }