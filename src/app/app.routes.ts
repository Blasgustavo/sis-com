import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AuthGuard } from './core/guards/auth.guard';
import { NoauthGuard } from './core/guards/noauth.guard';

export const routes: Routes = [
    //redirecciona la ruta vacia a login si no esta loggeado
    {path:'', redirectTo:'login', pathMatch:'full'},
    //ruta para el componente login
    {path:'login',
        canActivate: [NoauthGuard],
        loadComponent: () => import('./features/auth/components/login').then(m => m.Login)
    },
    //rutas para el componente home
    //protege la ruta home con el AuthGuard y solo permite el acceso si el usuario esta loggeado
    {path:'home',
        component: Home,
        canActivate: [AuthGuard],
        children: [
            //ruta hija para el modulo de usuarios
            //{path:'', redirectTo:'homepage', pathMatch:'full'},
            // rutas inicio
            {path:'homepage', loadComponent: () => import('./features/auth/components/homepage').then(m => m.Homepage)},
            {path:'update', loadComponent: () => import('./features/reports/components/updates').then(m => m.Updates)},
            //rutas programacion
            {path:'taskpage', loadComponent: () => import('./features/programation/components/taskpage').then(m => m.Taskpage)},
            {path:'monitoringpage', loadComponent: () => import('./features/programation/components/monitoringpage').then(m => m.Monitoringpage)},
            {path:'historypage', loadComponent: () => import('./features/programation/components/historypage').then(m => m.Historypage)},
            //rutas reportes
            {path:'reportspage', loadComponent: () => import('./features/reports/components/reportspage').then(m => m.Reportspage)},
            {path:'exportspage', loadComponent: () => import('./features/reports/components/exportspage').then(m => m.Exportspage)},
            //rutas perfil
            {path: 'perfilpage', loadComponent: () => import('./features/user/components/perfilpage').then(m => m.Perfilpage)},
            {path: 'updateuser', loadComponent: () => import('./features/user/components/update-user').then(m => m.UpdateUser)},
            //rutas Usuarios
            {path: 'listuserpage', loadComponent: () => import('./features/user/components/list-users').then(m => m.ListUsers)},
            {path: 'gestionuserpage', loadComponent: () => import('./features/user/components/gestion-users').then(m => m.GestionUser)},
            
            //redirige si la ruta es errada
            {path:'**',redirectTo:''},

        ]
    },
    //Redirecciiona a login si la ruta no existe
    {path:'**', redirectTo:'home'}
];