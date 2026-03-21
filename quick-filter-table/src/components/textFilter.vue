<template>
    <FilterIcon v-if="filterable" @clicked="showFilter = !showFilter" :active="active"></FilterIcon>
    {{ header.text }}
    <div v-show="filterable && showFilter" class="filter-dropdown" @click.stop>
        <div class="input-group mt-3 mb-1">
            <input class="form-control form-control-sm" ref="filter" type="text" v-model="value" @input="update_filter"
                @focus="focusChanged" @blur="focusChanged" :class="{ 'focused': filterFocused }"
                placeholder="Filter..." />
            <div class="input-group-append">
                <button type="button" class="btn btn-primary" v-if="true" @click="clear_filter"
                    for="search">&times;</button>
            </div>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import FilterIcon from './_filter.vue';
export default {
    name: 'TextFilter',
    components: {
        FilterIcon
    },
    props: ['header', 'all_values'],
    emits: ['update-filter'],
    data: function () {
        return {
            filterable: this.header.filter !== null && this.header.filter !== undefined,
            showFilter: false,
            value: null,
            filterFocused: false,
            active: false,
        }
    },
    methods: {
        update_filter() {
            debounce(() => {
                this.active = this.value != null && this.value.length > 0;
                this.$emit('update-filter', this.value);
            }, 300)();
        },
        focusChanged(event) {
            var el = event.target;
            this.filterFocused = el == this.$refs.filter;
        },
        clear_filter() {
            this.value = null;
            this.update_filter();
        }
    }
}
</script>