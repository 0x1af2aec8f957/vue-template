<template>
  <div id="pagination" v-if="!hideOnSinglePage || (total > pageSize)">
    <button class="pagination-previous"
            :disabled="current <= 1"
            @click.stop="handleChange(current - 1)">Previous</button>
    <button class="pagination-next"
            :disabled="current >= pageTotal"
            @click.stop="handleChange(current + 1)">Next</button>
    <ul class="pagination-list">
      <li>
        <button v-if="current > 1" class="pagination-link" @click.stop="handleChange(1)">1</button>
      </li>
      <li v-if="current > 4">
        <button class="pagination-ellipsis"
                @click.stop="handleChange(current - 4)">&hellip;</button>
      </li>
      <li v-if="current > 3">
        <button class="pagination-link"
                @click.stop="handleChange(current - 2)">{{current - 2}}</button>
      </li>
      <li v-if="current > 2">
        <button class="pagination-link"
                @click.stop="handleChange(current - 1)">{{current - 1}}</button>
      </li>
      <li>
        <button class="pagination-link is-current"
                disabled>{{current}}</button>
      </li>
      <li v-if="current < pageTotal - 1">
        <button class="pagination-link"
                @click.stop="handleChange(current + 1)">{{current + 1}}</button>
      </li>
      <li v-if="current < pageTotal - 2">
        <button class="pagination-link"
                @click.stop="handleChange(current + 2)">{{current + 2}}</button>
      </li>
      <li v-if="current < pageTotal - 3">
        <button class="pagination-ellipsis"
                @click.stop="handleChange(current + 4)">&hellip;</button>
      </li>
      <li v-if="current < pageTotal">
        <button class="pagination-link"
                @click.stop="handleChange(pageTotal)">{{pageTotal}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  data() {
    return {
      current: 1,
    };
  },
  props: {
    hideOnSinglePage: { type: Boolean, default: false },
    total: { type: Number, default: 10 },
    pageSize: { type: Number, default: 1 },
  },
  computed: {
    pageTotal() {
      const { total, pageSize } = this;
      return Math.ceil(total / pageSize);
    },
  },
  methods: {
    handleChange(pageCurrent) {
      this.current = pageCurrent;
      this.$emit('onChange', pageCurrent);
    },
  },
};
</script>

<style scoped lang="scss">
  #pagination {
    & > * {
      display: inline-block;
    }
  }

  .pagination-list {
    margin: 0;
    padding: 0;

    & > li {
      list-style: none;

      .is-current {
        background-color: #2196f3 !important;
      }
    }
  }
</style>
