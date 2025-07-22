<template>
  <nav class="pagination-container" aria-label="Pagination Navigation">
    <button
      class="pagination-button"
      :disabled="currentPage === 1"
      @click="changePage(1)"
      aria-label="First Page"
    >
      &laquo;
    </button>
    <button
      class="pagination-button"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      aria-label="Previous Page"
    >
      <
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="pagination-button"
      :class="{ active: page === currentPage }"
      @click="changePage(page)"
      :aria-current="page === currentPage ? 'page' : null"
    >
      {{ page }}
    </button>

    <button
      class="pagination-button"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      aria-label="Next Page"
    >
      >
    </button>
    <button
      class="pagination-button"
      :disabled="currentPage === totalPages"
      @click="changePage(totalPages)"
      aria-label="Last Page"
    >
      &raquo;
    </button>
  </nav>
</template>

<script>
export default {
  name: 'CustomPagination',
  props: {
    totalRecords: {
      type: Number,
      required: true,
    },
    rowsPerPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:currentPage'],
  computed: {
    totalPages() {
      return Math.ceil(this.totalRecords / this.rowsPerPage);
    },
    pages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    changePage(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.$emit('update:currentPage', page);
      }
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 1rem 0;
}

.pagination-button {
  background: none;
  border: none;
  color: #6b7280; /* gray-500 */
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-radius: 9999px; /* full rounded */
  transition: background-color 0.3s, color 0.3s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e5e7eb; /* gray-200 */
  color: #111827; /* gray-900 */
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-button.active {
  background-color: #111827; /* gray-900 */
  color: white;
  pointer-events: none;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
@media (max-width: 480px) {
  .pagination-container {
    gap: 0.25rem;
    padding: 0.5rem 0;
  }
  .pagination-button {
    font-size: 0.875rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
