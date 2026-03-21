<template>
    <FilterIcon v-if="filterable" @clicked="showFilter = !showFilter; console.log('clicked on', header)"
        :active="active"></FilterIcon>
    {{ header.text }}
    <div v-if="filterable" class="filter-dropdown slider-wrapper" :class="classForShowFilter" @click.stop>
        <!-- <input type="range" class="form-control-range" v-model="value" :min="minValue" :max="maxValue"
            @input="update_filter" /> -->
        <div ref="_sliderElement"></div>
    </div>
</template>

<script>
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { sortedUniq } from 'lodash';
import FilterIcon from './_filter.vue';
export default {
    name: 'NumberRangeFilter',
    components: {
        FilterIcon
    },
    props: ['header', 'all_values'],
    emits: ['update-filter'],
    data: function () {
        var sorted = this.all_values.map((x) => { return parseFloat(x) }).filter((x) => { return x != NaN }).sort();
        console.log("sorted", sorted, "all", this.all_values);

        var uniqueValues = sortedUniq(sorted);
        return {
            filterable: this.header.filter !== null && this.header.filter !== undefined,
            showFilter: false,
            minValue: this.all_values ? sorted[0] : null,
            maxValue: this.all_values ? sorted.at(-1) : null,
            value: null,
            _sorted: sorted,
            _uniqueValues: uniqueValues,
            _sliderInstance: null,
            // _sliderElement: null,
        }
    },
    computed: {
        marks: function () {
            var result = [];

            if (!this.all_values) return {};
            if (this.maxValue - this.minValue <= 10) {
                if (this._uniqueValues.every(v => Number.isInteger(v))) {
                    result = true;
                } else {
                    result = this._uniqueValues;
                }
            }
            result = true;

            return result;
        },
        classForShowFilter: function () {
            return this.showFilter ? "" : "hidden";
        },
        active: function () {
            var result = this.value != null && this.value.length === 2 && (this.value[0] != this.minValue || this.value[1] != this.maxValue);
            console.log("Marking filter as active:", result);
            return result;
        }
    },
    mounted() {
        console.log("mounted")
        this.$nextTick(() => {
            const el = this.$refs._sliderElement;

            if (!el) {
                console.error("Slider element ref is still undefined!");
                return;
            }
            console.log("creating slider with min", this.minValue, "max", this.maxValue, this.$refs._sliderElement);
            this._sliderInstance = noUiSlider.create(this.$refs._sliderElement, {
                start: [this.minValue, this.maxValue], // Initial handle positions
                connect: true,                        // Color the bar between handles
                range: {
                    'min': this.minValue,                           // Minimum bound
                    'max': this.maxValue                          // Maximum bound
                },
                step: 1,
                pips: {
                    mode: 'count',      // or 'values', 'count', 'percentage'
                    density: 5,         // how many small markers appear
                    values: 5,
                    stepped: true       // markers align with your 'step' value
                }
            });
            this._sliderInstance.on('update', (low, high) => {
                this.update_filter(low, high);
            });
        });
    },
    onBeforeUnmount() {
        if (this._sliderInstance) {
            this._sliderInstance.destroy();
        }
    },
    methods: {
        update_filter(values, _ignore) {
            var low = parseFloat(values[0]);
            var high = parseFloat(values[1]);
            this.value = [low, high];
            console.log("update filter", low, high);
            this.$emit('update-filter', [low, high]);
        }
    }
}
</script>

<style scoped>
.filter-dropdown {
    padding-bottom: 3em;
    overflow-y: visible;
}

.slider-wrapper {
    /* padding: 40px; */
    margin-left: 10px;
    margin-right: 10px;
    max-width: 400px;
}

/* 1. Make the bar between handles Blue */
:deep(.noUi-connect) {
    background: #043b75;
}

/* 2. Make the handles Round */
:deep(.noUi-handle) {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    right: -12px;
    /* Center the circle on the edge */
    top: -6px;
    /* Adjust vertical alignment */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

/* Remove the default "inner lines" from handles */
:deep(.noUi-handle::before),
:deep(.noUi-handle::after) {
    display: none;
}

/* 3. Style the Marks (Pips) */
:deep(.noUi-marker-large),
:deep(.noUi-marker-sub) {
    background: #ccc;
}

:deep(.noUi-value) {
    font-size: 12px;
    color: #666;
}
</style>