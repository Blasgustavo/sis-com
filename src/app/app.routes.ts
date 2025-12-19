import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Home } from './component/home/home';
import { AuthGuard } from './service/auth.guard';

export const routes: Routes = [
    //ruta para el componente login
    {path:'login', component: Login},
    //ruta para el componente home
    //protege la ruta home con el AuthGuard y solo permite el acceso si el usuario esta loggeado
    {path:'home', component: Home, canActivate: [AuthGuard]},
    //redirecciona la ruta vacia a login si no esta loggeado
    {path:'', redirectTo:'login', pathMatch:'full'},
    //Redirecciiona a login si la ruta no existe
    {path:'**', redirectTo:'login'}
];