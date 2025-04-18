import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueConfetti from 'vue-confetti'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueConfetti)

app.mount('#app')
