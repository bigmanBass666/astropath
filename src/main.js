import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

import './styles/index.css'
import './styles/variables.css'
import './styles/animations.css'
import './styles/utilities.css'
import './styles/atmosphere.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.mount('#app')
