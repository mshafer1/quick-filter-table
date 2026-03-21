<template>
    <FilterIcon v-if="filterable" @clicked="showFilter = !showFilter; console.log('clicked on', header)"
        :active="active"></FilterIcon>
    {{ header.text }}
    <div v-show="filterable && showFilter" class="filter-dropdown" @click.stop>
        <span><button @click="clear">&times; Clear</button></span>
        <ul type="none" class="mt-2 mb-0 ml-0">
            <li v-for="(option, index) in uniqueValues" :key="option">
                <input type="checkbox" :id="index + slugify(option)" :value="option" v-model="value[option]"
                    @change="update_filter">&nbsp;
                <label :for="index + slugify(option)">{{ option }}</label>
            </li>
        </ul>
    </div>
</template>

<script>
import { sortedUniq, uniq } from 'lodash';
import FilterIcon from './_filter.vue';
export default {
    name: 'MultiDistinctFilter',
    components: {
        FilterIcon
    },
    props: ['header', 'all_values'],
    emits: ['update-filter'],
    data: function () {
        return {
            filterable: this.header.filter !== null && this.header.filter !== undefined,
            showFilter: false,
            uniqueValues: sortedUniq(this.all_values.sort()),
            value: {},
            active: false,
        }
    },
    methods: {
        update_filter() {
            var result = Object.keys(this.value).filter(key => this.value[key]).join('\x00');
            this.active = result.length > 0;
            console.log("Updating filter with value", result);
            this.$emit('update-filter', result);
        },
        clear() {
            Object.keys(this.value).forEach(key => {
                this.value[key] = false;
            });
            this.update_filter();
        },
        slugify(str) {
            return String(str).replace(/\s/g, '-').replace(/[^a-zA-Z0-9_\-]/g, '_');
        }
    }
}
</script>

<style scoped>
.filter-dropdown {
    padding-bottom: 1em;
    min-height: 3em;
    max-height: 10em;
}

ul {
    padding-inline-start: 0px;
}
</style>