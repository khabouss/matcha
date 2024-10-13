<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <h2 class="popup-header">Sort & Filter Profiles</h2>

      <!-- Sorting Options -->
      <div class="popup-section">
        <h3 class="section-header">Sort by</h3>
        <div class="sort-options">
          <label class="radio-label">
            <input type="radio" v-model="sortOption" value="age" />
            Age
          </label>
          <label class="radio-label">
            <input type="radio" v-model="sortOption" value="location" />
            Location
          </label>
          <label class="radio-label">
            <input type="radio" v-model="sortOption" value="fame" />
            Fame Rating
          </label>
          <label class="radio-label">
            <input type="radio" v-model="sortOption" value="tags" />
            Common Tags
          </label>
        </div>
      </div>

      <!-- Filtering Options -->
      <div class="popup-section">
        <h3 class="section-header">Filter by</h3>

        <!-- Age Range -->
        <label class="filter-label">
          Age Range: 
          <input type="range" v-model="ageGap" min="18" max="100" class="range-input" />
          <span>{{ ageGap }}</span>
        </label>

        <!-- Location -->
        <label class="filter-label">
          Location: 
          <input type="text" v-model="location" placeholder="Enter location" class="input-text" />
        </label>

        <!-- Fame Rating -->
        <label class="filter-label">
          Fame Rating: 
          <input type="number" v-model="fameRating" min="0" max="10" class="input-number" placeholder="Enter fame rating" />
        </label>

        <!-- Interest Tags -->
        <label class="filter-label">
          Interest Tags: 
          <select v-model="interestTags" multiple class="select-tags">
            <option v-for="tag in availableTags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="popup-actions">
        <button @click="applyFilters" class="btn apply-btn">Apply</button>
        <button @click="closePopup" class="btn cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sortOption: 'age',
      ageGap: 18,
      location: '',
      fameRating: 0,
      interestTags: [],
      availableTags: ['Sports', 'Music', 'Travel', 'Food', 'Movies'], // Example tags
    };
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    applyFilters() {
      const filters = {
        sortOption: this.sortOption,
        ageGap: this.ageGap,
        location: this.location,
        fameRating: this.fameRating,
        interestTags: this.interestTags,
      };
      this.$emit('apply-filters', filters);
      this.closePopup();
    },
  },
};
</script>

<style scoped>
.popup-container::-webkit-scrollbar {
  display: none;
}

.popup-container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Overlay styling */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Popup container */
.popup-container {
  background-color: #fff;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  height: 70vh;
  overflow-x: hidden;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
}

/* Popup header */
.popup-header {
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* Section header */
.section-header {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #555;
}

/* Sort and filter label styles */
.radio-label, .filter-label {
  display: block;
  margin-bottom: 15px;
  color: #666;
  font-weight: 400;
}

/* Input styles */
.input-text, .input-number, .select-tags {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 5px;
}

.range-input {
  width: 100%;
  margin-top: 5px;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.apply-btn {
  background-color: #007bff;
  color: white;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.popup-actions {
  text-align: right;
  margin-top: 20px;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
