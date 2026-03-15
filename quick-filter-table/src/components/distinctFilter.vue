<template>
    <FilterIcon v-if="filterable" @clicked="showFilter = !showFilter; console.log('clicked on', header)"
        :active="active"></FilterIcon>
    {{ header.text }}
    <div v-if="filterable && showFilter" class="filter-dropdown" @click.stop>
        <select class="form-control form-control-sm form-select" v-model="value" @change="update_filter">
            <option :value="null">All</option>
            <option v-for="option in uniqueValues" :value="option">
                {{ option }}
            </option>
        </select>
    </div>
</template>

<script>
import { sortedUniq, uniq } from 'lodash';
import FilterIcon from './_filter.vue';
export default {
    name: 'DistinctFilter',
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
            value: null,
            active: false,
        }
    },
    methods: {
        update_filter() {
            this.active = this.value != null && this.value.length > 0;
            this.$emit('update-filter', this.value);
        }
    }
}
</script>