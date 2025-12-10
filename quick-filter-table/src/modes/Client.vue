<script setup>
import Vue3EasyDataTable from 'vue3-easy-data-table';
</script>

<template>
    <div class="TODO" style="position: relative; width: 100%; padding-top: 20px; padding-bottom: 100px;">
        <div v-if="!loaded" style="text-align: center; padding: 20px;">
            Loading...
        </div>
        <div v-else>
            <div>
                <input ref="search" type="text" v-model="searchValue" @input="update_search" @focus="focusChanged"
                    @blur="focusChanged" :class="{ 'focused': searchFocused }" placeholder="Search..." />
                <label v-if="searchValue" @click="clear_search" for="search"
                    style="position: absolute; top: 12px; right: 24px; z-index: 99;">
                    x
                </label>
            </div>
            <Vue3EasyDataTable buttons-pagination :headers="used_headers" :items="working_items"
                :rows-per-page="default_rows_per_page" table-class-name="customize-table" alternating>
            </Vue3EasyDataTable>
        </div>
    </div>
</template>

<script>
import { fuzzyFilter } from "fuzzbunny";
import debounce from 'lodash/debounce';

export default {
    name: 'ClientMode',
    components: {
        Vue3EasyDataTable,
    },
    props: ['headers', 'items', "loaded", 'default_rows_per_page'],
    data: function () {
        return {
            working_items: this.items,
            all_items: this.items,
            used_headers: this.headers,
            header_names: this.headers.map(h => h.value),
            searchFocused: false,
            searchValue: "",
        }
    },
    mounted: function () {
    },
    created() {
        console.log('QuickFilterTable app created.')
        console.log('Columns:', this.used_headers)
        console.log('Items:', this.items)
    },
    methods: {
        update_search() {
            console.log("Search value:", this.searchValue);
            debounce(() => {
                if (this.searchValue.trim() === "") {
                    this.working_items = this.all_items;
                    return;
                }
                console.log("Performing fuzzy search for:", this.searchValue.trim(), "in", this.all_items, "fields:", this.header_names);
                var search_results = fuzzyFilter(this.all_items, this.searchValue.trim(), { fields: this.header_names })
                console.log("Fuzzy search results:", search_results);
                this.working_items = search_results.map(r => r.item);
                console.log("Updated items:", this.working_items);
            }, 300)();
        },
        clear_search() {
            this.searchValue = "";
            this.working_items = this.all_items;
            try {
                this.$refs.search.focus();
            } catch (e) { }
        },
        focusChanged(event) {
            var el = event.target;
            this.searchFocused = el == this.$refs.search;
        },
    },
    watch: {
        items(newItems) {
            this.all_items = newItems;
            this.working_items = newItems;
            this.clear_search();
        }
    }
}
</script>