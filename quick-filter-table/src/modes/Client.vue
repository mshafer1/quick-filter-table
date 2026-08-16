<script setup>
import Vue3EasyDataTable from 'vue3-easy-data-table';
</script>

<template>
    <div class="" style="position: relative; width: 100%; padding-top: 20px; padding-bottom: 100px;">
        <div v-if="!loaded" style="text-align: center; padding: 20px;">
            Loading...
        </div>
        <div v-else class="mx-3 my-1">
            <div class="input-group mt-3 mb-1">
                <input name="search" class="form-control" ref="search" type="text" v-model="searchValue"
                    @input="update_search" @focus="focusChanged" @blur="focusChanged"
                    :class="{ 'focused': searchFocused }" placeholder="Search..." />
                <div class="input-group-append">
                    <button type="button" title="clear search" class="btn btn-primary" v-if="searchValue"
                        @click="clear_search" aria-label="Clear search">&times;</button>
                </div>
            </div>
            <Vue3EasyDataTable buttons-pagination :headers="used_headers" :items="working_items"
                :rows-per-page="default_rows_per_page" :rows-items="rowsPerPageOptions" :hide-footer="hideFooter"
                table-class-name="customize-table" alternating :slotNames="html_slots" :filter-options="filterOptions"
                :key="pageResetFlag">
                <template v-for="(field, index) in html_slots" v-slot:[`item-${field}`]="item">
                    <span v-html="item[field]"></span>
                </template>
                <template v-for="(header, index) in filtered_headers" v-slot:[`header-${header.value}`]="header">
                    <DistinctFilter :header="header" :all_values="all_items.map(i => i[header.value])"
                        v-if="header.filter == 'distinct'" @update-filter="update_filter(header, $event)" />
                    <MultiDistinctFilter :header="header" :all_values="all_items.map(i => i[header.value])"
                        v-else-if="header.filter == 'distinctMulti'" @update-filter="update_filter(header, $event)" />
                    <NumberRangeFilter :header="header" :all_values="all_items.map(i => i[header.value])"
                        v-else-if="header.filter == 'numberRange'" @update-filter="update_filter(header, $event)" />
                    <TextFilter :header="header" :all_values="all_items.map(i => i[header.value])"
                        v-else-if="header.filter == 'text'" @update-filter="update_filter(header, $event)" />
                    <span v-else>{{ header.text }}
                        <span v-show="false"> &#9888; Invalid filter '{{ header.filter }}'</span>
                    </span>
                </template>
            </Vue3EasyDataTable>
        </div>
    </div>
</template>

<script>
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'vue3-easy-data-table/dist/style.css';

import DistinctFilter from '@/components/distinctFilter.vue';
import MultiDistinctFilter from '@/components/multiDistinctFilter.vue';
import NumberRangeFilter from '@/components/numberRangeFilter.vue';
import TextFilter from '@/components/textFilter.vue';

function getMinMax(values) {
    // Avoid spreading large arrays into Math.min/Math.max, which can exceed engine argument limits.
    if (!Array.isArray(values) || values.length === 0) {
        return { min: null, max: null };
    }

    let min = values[0];
    let max = values[0];
    for (let i = 1; i < values.length; i += 1) {
        const value = values[i];
        if (value < min) min = value;
        if (value > max) max = value;
    }

    return { min, max };
}

export default {
    name: 'ClientMode',
    components: {
        Vue3EasyDataTable,
        DistinctFilter,
        MultiDistinctFilter,
        NumberRangeFilter,
        TextFilter,
    },
    props: ['headers', 'items', "loaded", 'default_rows_per_page', 'rows_per_page_options'],
    data: function () {
        var headers_with_filters = this.headers.filter(h => h.filter !== null)
        headers_with_filters = headers_with_filters.map(h => {
            if (h.showFilter === undefined) {
                h.showFilter = false;
            }
            if (h.filterValue === undefined) {
                h.filterValue = null;
            }
            return h;
        })

        return {
            working_items: this.items,
            all_items: this.items,
            used_headers: this.headers,
            header_names: this.headers.map(h => h.value),
            searchFocused: false,
            searchValue: "",
            filtered_headers: headers_with_filters,
            hideFooter: this.rows_per_page_options == null,
            rowsPerPageOptions: (this.rows_per_page_options == null) ? [] : this.rows_per_page_options,
            pageResetFlag: 1,
            searchFuse: null,
            searchDebounced: null,
            // refreshKey: 0, // just used to force computed values to refresh when needed
        }
    },
    mounted: function () {
    },
    computed: {
        html_slots() {
            return this.used_headers.filter(h => h.html == true).map(h => h.value);
        },
        filterOptions() {
            // this.refreshKey; // reference just to trigger recomputation when needed
            const result = [];
            this.filtered_headers.forEach(h => {
                if (h.filter == 'distinct' && h.filterValue !== null) {
                    result.push({
                        field: h.value,
                        comparison: (value, criteria) => {
                            try {
                                return value == criteria;
                            } catch (e) {
                                return false;
                            }
                        },
                        criteria: h.filterValue
                    });
                }
                if (h.filter == 'text' && h.filterValue !== null && String(h.filterValue).trim() !== "") {
                    result.push({
                        field: h.value,
                        comparison: (value, criteria) => {
                            try {
                                if (typeof criteria !== "string") { criteria = String(criteria); }
                                const shortCriteria = criteria.trim();
                                const searchableValue = value == null ? "" : String(value);
                                const compareValue = shortCriteria.toLowerCase() === shortCriteria ? searchableValue.toLowerCase() : searchableValue;
                                return compareValue.includes(shortCriteria);
                            } catch (e) {
                                return false;
                            }
                        },
                        criteria: h.filterValue,
                    });
                }
                if (h.filter == 'numberRange' && h.filterValue !== null && (h.filterValue[0] !== null || h.filterValue[1] !== null)) {
                    const rangeValues = Array.isArray(this.all_items)
                        ? this.all_items
                            .map(item => parseFloat(item?.[h.value]))
                            .filter(value => typeof value === 'number' && !isNaN(value))
                        : [];
                    const { min: columnMin, max: columnMax } = getMinMax(rangeValues);
                    const min = h.filterValue[0] == null ? null : parseFloat(h.filterValue[0]);
                    const max = h.filterValue[1] == null ? null : parseFloat(h.filterValue[1]);
                    const isFullRange = columnMin !== null && columnMax !== null && min === columnMin && max === columnMax;

                    if (isFullRange) {
                        return;
                    }

                    result.push({
                        field: h.value,
                        comparison: (value, criteria) => {
                            try {
                                var numValue = parseFloat(value);
                                if (isNaN(numValue)) return false;
                                if (min !== null && numValue < min) return false;
                                if (max !== null && numValue > max) return false;
                                return true;
                            } catch (e) {
                                return false;
                            }
                        },
                        criteria: h.filterValue,
                    });
                }
                if (h.filter == 'distinctMulti' && h.filterValue !== null && String(h.filterValue).trim() !== "") {
                    var options = new Set(String(h.filterValue).split('\x00'));
                    result.push({
                        field: h.value,
                        comparison: (value, criteria) => {
                            try {
                                return options.has(value);
                            } catch (e) {
                                return false;
                            }
                        },
                        criteria: h.filterValue,
                    });
                }
            })
            return result;
        }
    },
    created() {
        console.debug('QuickFilterTable app created.')
        console.debug('Columns:', this.used_headers)
        console.debug('Items:', this.items)
        this.searchDebounced = debounce(() => {
            if (this.searchValue.trim() === "") {
                this.working_items = this.all_items;
                this.pageResetFlag += 1; // reset to first page when search changes
                return;
            }
            console.debug("Performing fuzzy search for:", this.searchValue.trim(), "in", this.all_items, "fields:", this.header_names);

            if (this.searchFuse == null) {
                this.working_items = this.all_items;
                this.pageResetFlag += 1;
                return;
            }

            const search_results = this.searchFuse.search(this.searchValue.trim());
            console.debug("Fuzzy search results:", search_results);
            this.working_items = search_results.filter(r => r.score !== undefined).map(r => r.item);
            this.pageResetFlag += 1; // reset to first page when search changes
            console.debug("Updated items:", this.working_items);
        }, 300);
    },
    beforeUnmount() {
        if (this.searchDebounced && typeof this.searchDebounced.cancel === "function") {
            this.searchDebounced.cancel();
        }
    },
    methods: {
        rebuildSearchFuse(items) {
            const searchableKeys = this.header_names.filter(Boolean);
            this.searchFuse = new Fuse(items, {
                keys: searchableKeys,
                includeScore: true,
                threshold: 0.30, // 0 is strict, 1 is match anything.
                useTokenSearch: true,
                ignoreLocation: true,
                shouldSort: true,
                findAllMatches: true,
            });
        },
        update_search() {
            this.searchDebounced();
        },
        clear_search() {
            this.searchValue = "";
            this.working_items = this.all_items;
            try {
                this.$refs.search.focus();
            } catch (e) { }
        },
        focusChanged(event) {
            this.searchFocused = event.type === 'focus';
        },
        update_filter(header, value) {
            console.debug("Updating filter for header:", header, "with value:", value);
            this.filtered_headers.forEach(h => {
                if (h.value == header.value) {
                    h.filterValue = value;
                }
            })
            // this.refreshKey += 1; // trigger recomputation of filterOptions
        }
    },
    watch: {
        items: {
            immediate: true,
            handler(newItems) {
                this.all_items = Array.isArray(newItems) ? newItems : [];
                this.working_items = this.all_items;
                this.rebuildSearchFuse(this.all_items);
                this.clear_search();
            }
        }
    }
}
</script>

<style>
.filter-dropdown {
    position: absolute;
    z-index: 1000;
    background: white;
    border: 1px solid black;
    /* padding: 10px; */
    margin-top: 5px;
    margin-left: 5px;
    top: 30px;
    min-width: 150px;

    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    padding-top: .5em;

    overflow-y: scroll;
}
</style>
