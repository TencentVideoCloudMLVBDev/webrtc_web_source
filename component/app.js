var router = new VueRouter({
    //mode: 'history',
    routes:[
        {
            path:'/',
            name: 'list',
            component:CourseList,
        },
        {
            path:'/create',
            name: 'create',
            component:CreateCourse,
        },
        /*
        {
            path: '/join',
            name: 'join',
            component: joinClass,
        },*/
        {
            path: '/main',
            name: 'Main',
            component: MainView,
        },
    ]
});

Vue.use(Toast, {
    defaultType: 'center',
    duration: 3000,
    wordWrap: true,
    width: '150px'
});

new Vue({
    el: '#vue-app',
    //components:{'courselist': courseView},
    router:router,
});
