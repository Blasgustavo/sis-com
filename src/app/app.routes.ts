import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Home } from './component/home/home';
import { AuthGuard } from './service/auth.guard';
import { Updates } from './component/start/updates/updates';

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
            // rutas inicio
            {path:'homepage', loadComponent: () => import('./component/start/homepage/homepage').then(m => m.Homepage)},
            {path:'update', loadComponent: () => import('./component/start/updates/updates').then(m => m.Updates)},
            //rutas programacion
            {path:'taskpage', loadComponent: () => import('./component/programation/taskpage/taskpage').then(m => m.Taskpage)},
            {path:'monitoringpage', loadComponent: () => import('./component/programation/monitoringpage/monitoringpage').then(m => m.Monitoringpage)},
            {path:'historypage', loadComponent: () => import('./component/programation/historypage/historypage').then(m => m.Historypage)},
            //rutas reportes
            {path:'reportspage', loadComponent: () => import('./component/reports/reportspage/reportspage').then(m => m.Reportspage)},
            {path:'exportspage', loadComponent: () => import('./component/reports/exportspage/exportspage').then(m => m.Exportspage)},
            //rutas perfil
            {path: 'perfilpage', loadComponent: () => import('./component/perfil/perfilpage/perfilpage').then(m => m.Perfilpage)},
            {path: 'updateuser', loadComponent: () => import('./component/perfil/update-user/update-user').then(m => m.UpdateUser)}
        ]
    },
    //Redirecciiona a login si la ruta no existe
    {path:'**', redirectTo:'login'}
];