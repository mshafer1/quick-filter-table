import ClientVue from './modes/Client.vue'

export const QuickFilterTable = ClientVue

// QuickFilterTable.initializeQuickFilterTable = (data) => {
//   console.log('Initializing QuickFilterTable with data:', data)
//   const { targetId, headers } = data // required fields
//   const itemsUrl = data.itemsUrl || null // optional field
//   const itemsPassed = data.items || [] // optional field
//   console.log('itemsUrl:', itemsUrl)
//   console.log('items:', itemsPassed)
//   if (!itemsUrl && itemsPassed.length === 0) {
//     console.error('QuickFilterTable: itemsUrl or items is required.')
//     return
//   }
//   const { createApp } = window.Vue
//   const { QuickFilterTable } = window.QuickFilterTable

//   const app = createApp({
//     template: ` <div>
//       <h1>{{ message }}</h1>
//       <p>Current count: {{ count }}</p>
//       <button @click="count++">Increment</button>
//       <QuickFilterTable :headers="headers" :datum="items" />
//       <div>{{ items }}</div>
//     </div>`,
//     data() {
//       return {
//         message: 'Hello from QuickFilterTable!',
//         count: 0,
//         headers: headers,
//         items: itemsPassed,
//       }
//     },
//     components: {
//       QuickFilterTable,
//     },
//     mounted() {
//       if (itemsUrl != null) this.fetchItems()
//     },
//     methods: {
//       fetchItems() {
//         console.log('Fetching items from URL:', this.itemsUrl)
//         fetch(itemsUrl)
//           .then((response) => response.json())
//           .then((data) => {
//             this.items = data
//           })
//           .catch((error) => {
//             console.error('Error fetching items:', error)
//           })
//       },
//       // clicked
//     },
//   })

//   app.mount(`#${targetId}`)
// }
// QuickFilterTable.mount = (targetId, data) => {
//   const { createApp } = window.Vue
//   const app = createApp(ClientVue, {
//     targetId,
//     headers: data.headers,
//     itemsUrl: data.itemsUrl || null,
//     items: data.items || [],
//     template: ` <div>
//       <h1>{{ message }}</h1>
//       <p>Current count: {{ count }}</p>
//       <button @click="count++">Increment</button>
//       <QuickFilterTable :headers="headers" :datum="items" />
//       <div>{{ items }}</div>
//     </div>`,
//   })
//   app.mount(`#${targetId}`)
// }

// Import all necessary parts of Vue and your components
import { createApp, onMounted } from 'vue'
import axios from 'axios'
import ClientMode from './modes/Client.vue'
import VueEasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css' // Don't forget the CSS!

/**
 * The main function exposed to the global scope by the CDN library.
 * It mounts the Vue application into the specified DOM element.
 * * @param {string} targetId The ID of the HTML element where the app should render.
 * @param {object} propsData Initial props to pass to the root component.
 */
function renderApp(targetId, propsData = {}) {
  const targetElement = document.getElementById(targetId)
  console.log('renderApp called with targetId:', targetId, 'propsData:', propsData)

  // required fields
  const headers = propsData.headers.map((header) => {
    return {
      ...header,
      // explicitly checking for undefined to allow `false` values
      sortable: header.sortable !== undefined ? header.sortable : true,
    }
  })

  if (!targetElement) {
    console.error(`Target element with ID "${targetId}" not found.`)
    return
  }

  if (propsData.items == null) {
    if (propsData.itemsUrl == null) {
      console.error('QuickFilterTable: itemsUrl or items is required.')
      return
    }
  }

  const RootWrapper = {
    template: `<ClientMode :headers="headers" :items="items" :loaded="loaded" :default_rows_per_page="default_rows_per_page" />`,
    components: { ClientMode },
    data() {
      return {
        headers: headers,
        items: propsData.items || [],
        itemsUrl: propsData.itemsUrl || null,
        default_rows_per_page: propsData.default_rows_per_page || 10,
        loaded: false,
      }
    },
    mounted() {
      if (this.itemsUrl != null) {
        console.log('Fetching items from URL:', this.itemsUrl)
        axios
          .get(this.itemsUrl)
          .then((response) => {
            this.items = response.data
            this.loaded = true
          })
          .catch((error) => {
            console.error('Error fetching items:', error)
          })
      } else {
        this.loaded = true
      }
    },
  }

  const app = createApp(RootWrapper)

  // Register the easy-data-table component globally for use inside your library's components
  app.component('EasyDataTable', VueEasyDataTable)

  // Mount the application to the target element
  app.mount(targetElement)
  console.log(`MyCdnLibrary mounted to #${targetId}`)
}

// Crucial: Expose the mounting function to the outside world
// (Vite's iife build will wrap this and attach it to the global object `MyCdnLibrary`)
export { renderApp }
