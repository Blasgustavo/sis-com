import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Home } from './component/home/home';
import { AuthGuard } from './service/auth.guard';

export const routes: Routes = [
    //redirecciona la ruta vacia a login si no esta loggeado
    {path:'', redirectTo:'login', pathMatch:'full'},
    //ruta para el componente login
    {path:'login', component: Login},
    //ruta para el componente home
    //protege la ruta home con el AuthGuard y solo permite el acceso si el usuario esta loggeado
    {path:'home',
        component: Home,
        canActivate: [AuthGuard],
        children: [
            //ruta hija para el modulo de usuarios
            {path:'', redirectTo:'homepage', pathMatch:'full'},
            {path:'homepage', loadComponent: () => import('./component/homepage/homepage').then(m => m.Homepage)},
            {path:'taskpage', loadComponent: () => import('./component/taskpage/taskpage').then(m => m.Taskpage)},
            {path:'reportspage', loadComponent: () => import('./component/reportspage/reportspage').then(m => m.Reportspage)},
            {path: 'perfilpage', loadComponent: () => import('./component/perfilpage/perfilpage').then(m => m.Perfilpage)}
        ]
    },
    //Redirecciiona a login si la ruta no existe
    {path:'**', redirectTo:'login'}
];