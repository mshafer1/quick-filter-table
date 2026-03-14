<template>
    <div @click="clicked" class="filter-wrapper" @click.stop>
        <div class="filter-bar">&#x2758;</div>
        <div class="filter-triangle">&#x25BC;</div>
        <div v-if="active" class="filter-triangle filter-active">&#x25BC;</div>
    </div>
</template>

<script>
export default {
    name: 'FilterIcon',
    components: {
    },
    emits: ['clicked'],
    props: ['active'],
    data: function () {
        return {
        }
    },
    methods: {
        clicked() {
            this.$emit('clicked');
        }
    }
}
</script>

<style scoped>
.filter-wrapper {
    position: relative;
    display: inline-block;
    width: 1em;
    height: 1em;
    cursor: pointer;
    margin-top: -0.5em;
}

.filter-triangle,
.filter-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 1em;
    text-align: center;
}

.filter-bar {
    top: 0.1em;
}

.filter-active {
    color: white;
    margin-top: -4px;
}
</style>