module.exports = {
    theme: 'antdocs',
    title: '陌小路的个人博客',
    description: 'Hello，欢迎来到陌小路的个人博客',
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: `/logo.png`,
            }
            // ['meta', { name: 'theme-color', content: '#3eaf7c' }],
            // ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
            // ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
            // ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
        ],
    ],
    dest: './docs/.vuepress/dist',
    ga: '',
    evergreen: true,
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/' },
            { text: 'github', link: 'https://github.com/STDSuperman' },
        ],
        sidebarDepth: 0,
        sidebar: {
            '/guide/': [
                {
                    title: '面试专题',
                    collapsable: true, // 可折叠
                    children: [
                        'interview/enter-url-progress',
                        'interview/call-bind',
                        'interview/pwa'
                    ]
                }, {
                    title: 'Vue专题',
                    collapsable: true, // 可折叠
                    children: [
                        'vue/Vue.nextTick',
                        'vue/vue3-beta',
                        'vue/vite',
                        'vue/vuex-01',
                        'vue/vuex-02'
                    ]
                }, {
                    title: 'Electron专题',
                    collapsable: true,
                    children: [
                        'electron/electron-tinypng'
                    ]
                }, {
                    title: '时光漫谈',
                    collapsable: true,
                    children: [
                        'time-talk/autumn-moves',
                        'time-talk/summary-2019'
                    ]
                }
            ]
        },
    },
};
