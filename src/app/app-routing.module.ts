import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShiJingComponent } from './pages/shi-jing/shi-jing.component';
import { ZuoZhuanComponent } from './pages/zuo-zhuan/zuo-zhuan.component';

const routes: Routes = [
  {
    path: 'zuo-zhuan',
    component: ZuoZhuanComponent
  },
  {
    path: 'shi-jing',
    component: ShiJingComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'zuo-zhuan'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
