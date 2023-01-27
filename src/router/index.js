import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { disallowAuthed: true}
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/UserView.vue'),
    meta: {
      Auth: true
    }
  },
  {
    path: '/user/:id',
    name: 'singleUser',
    component: () => import('../views/SingleUserView.vue'),
    meta: {
      Auth: true
    }
  },
  {
    path: '/notfound',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: '*',
    redirect: '/notfound'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.Auth)){
    if(sessionStorage.getItem('token')){
      next()
    }else{
      router.replace('/login')
    }
  }else if(to.matched.some(record => record.meta.disallowAuthed)){
    if(sessionStorage.getItem('token') != null){
      router.go(-1)
    }else{
      next()
    }
  }
  else{
    next()
  }
})

export default router
