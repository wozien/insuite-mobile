import { defineAsyncComponent } from 'vue'
import { RouteRecordRaw } from 'vue-router'

const Login = defineAsyncComponent(() => import('@views/layout/Login.vue'))
const Layout = defineAsyncComponent(() => import('@views/layout/Layout.vue'))
const Dashboard = defineAsyncComponent(() => import('@views/dashboard/Dashboard.vue'))
const Market = defineAsyncComponent(() => import('@views/market/Market.vue'))
const User = defineAsyncComponent(() => import('@views/user/User.vue'))
const CompanyList = defineAsyncComponent(() => import('@views/user/CompanyList.vue'))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: Dashboard
      },
      {
        path: '/market',
        component: Market
      },
      {
        path: '/user',
        component: User
      }
    ]
  },
  {
    path: '/companyList',
    component: CompanyList
  }
]

export default routes