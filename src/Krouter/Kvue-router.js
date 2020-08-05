let _Vue

class VueRouter {
  constructor(options) {
    this.$options = options
    console.log('options', options)
    //映射routes
    this.routeMap = {}
    this.$options.routes.forEach((route) => {
      this.routeMap[route.path] = route
    })

    //定义一个响应式的current属性
    const initial = window.location.hash.slice(1) || '/'
    //三个参数依次为绑定的实例、属性名称、属性值
    _Vue.util.defineReactive(this, 'current', initial)
    //监控url变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
  }
  onHashChange() {
    this.current = window.location.hash.slice(1)
    console.log(this.current)
  }
}
// Vue.use会将Vue实例传进来
VueRouter.install = function(Vue) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate() {
      // 在Vue的prototype上挂载 $router
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    },
  })
  // 创建组件跳转和替换
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    },
  })
  Vue.component('router-view', {
    render(h) {
      const { routeMap, current } = this.$router
      const component = routeMap[current] ? routeMap[current].component : null
      return h(component)
    },
  })
}

export default VueRouter
