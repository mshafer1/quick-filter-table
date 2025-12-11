import ClientVue from './modes/Client.vue'

export const QuickFilterTable = ClientVue

import { createApp, onMounted } from 'vue'
import axios from 'axios'
import ClientMode from './modes/Client.vue'
import VueEasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css' // Don't forget the CSS!
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

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
      // if html is explicitly set to true, use it; otherwise default to false
      html: header.html === true ? true : false,
    }
  })

  const getNestedValue = (data, path) => {
    // from Gemini
    // 1. Split the path string into an array of keys (e.g., ['rss', 'channel', 'item']).
    const pathKeys = path.split('.')

    // 2. Use reduce to iterate over the keys.
    return pathKeys.reduce((acc, key) => {
      // acc is the accumulated value (the current object being inspected).

      // Check if the current accumulator is null/undefined or if the key doesn't exist.
      // The conditional chaining operator (?.) ensures we stop immediately if a property is missing.
      return acc?.[key]
    }, data) // Start the accumulator with the entire data object.
  }

  if (!targetElement) {
    console.error(`Target element with ID "${targetId}" not found.`)
    return
  }

  if (propsData.items == null) {
    if (propsData.items_url == null) {
      console.error('QuickFilterTable: items_url or items is required.')
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
        items_url: propsData.items_url || null,
        default_rows_per_page: propsData.default_rows_per_page || 10,
        loaded: false,
      }
    },
    mounted() {
      if (this.items_url != null) {
        console.log('Fetching items from URL:', this.items_url)
        axios
          .get(this.items_url)
          .then((response) => {
            var data = response.data
            if (propsData.items_key != undefined) {
              data = getNestedValue(data, propsData.items_key)
            }
            if (propsData.items_map != undefined) {
              this.items = data.map(propsData.items_map)
            } else {
              this.items = data
            }
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
