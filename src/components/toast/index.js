import Vue from 'vue'
import Toast from './toast'

let toastConstructor = Vue.extend(Toast)

let toastModel = (o) => {
    let toastDom = new toastConstructor({
        el: document.createElement('div')
    })
    document.body.appendChild(toastDom.$el)
    
    toastDom.show = o.show
    toastDom.content = o.content || null
    return toastDom
}

export default toastModel