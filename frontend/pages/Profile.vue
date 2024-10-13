<template>
  <div class="profile-page">
    <header class="header">
      <h1>{{ user.firstName }}'s Profile</h1>
    </header>

    <section class="image-grid">
      <h2>Add Pictures</h2>
      <div class="grid">
        <div
          class="grid-item"
          v-for="(image, index) in gridImages"
          :key="index"
          @click="uploadImage(index)"
        >
          <img v-if="image" :src="image" alt="Image Upload" />
          <div v-else class="placeholder">
            <!-- SVG Placeholder -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              class="svg-placeholder"
            >
              <circle cx="50" cy="50" r="45" fill="#e9ecef" />
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa">
                Upload
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section class="profile-info">
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input v-model="user.firstName" type="text" id="firstName" required />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input v-model="user.lastName" type="text" id="lastName" required />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="user.email" type="email" id="email" required />
        </div>

        <div class="form-group">
          <label for="gender">Gender:</label>
          <select v-model="user.gender" id="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="sexualPreferences">Sexual Preferences:</label>
          <select v-model="user.sexualPreferences" id="sexualPreferences" required>
            <option value="heterosexual">Heterosexual</option>
            <option value="homosexual">Homosexual</option>
            <option value="bisexual">Bisexual</option>
            <option value="pansexual">Pansexual</option>
            <option value="asexual">Asexual</option>
          </select>
        </div>

        <div class="form-group">
          <label for="biography">Biography:</label>
          <textarea v-model="user.biography" id="biography" required></textarea>
        </div>

        <div class="form-group">
          <label for="interests">Interests:</label>
          <input v-model="newInterest" @keyup.enter="addInterest" placeholder="Add interest and press Enter" />
          <div class="tags">
            <span v-for="interest in user.interests" :key="interest" class="tag">#{{ interest }}</span>
          </div>
        </div>

        <button type="submit" class="btn-update">Update Profile</button>
      </form>
    </section>

    <section class="profile-stats">
      <h2 style="margin-bottom: 5px;">Profile Stats</h2>
      <p><strong>Likes:</strong> {{ likes.length }}</p>
      <p><strong>Fame Rating:</strong> {{ fameRating }}</p>
      <h3>Profiles Who Viewed This Profile</h3>
      <div class="viewed-profiles">
        <div
          class="profile-item"
          v-for="profile in viewedProfiles"
          :key="profile.id"
          @click="viewProfile(profile)"
        >
          <img :src="profile.image" alt="Profile Picture" class="profile-image" />
          <div style="display: flex; flex-direction: column;">
            <h4>{{ profile.name }}</h4>
            <span style="font-size: small;">{{ profile.gender }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const user = ref({
  firstName: 'Taha',
  lastName: '',
  email: '',
  gender: 'male',
  sexualPreferences: 'heterosexual',
  biography: '',
  interests: [],
});

const newInterest = ref('');
const likes = ref([]); // Array of users who liked the profile
const fameRating = ref(0); // Fame rating calculation logic goes here
const gridImages = ref([null, null, null, null, null]); // Holds image uploads for grid

// Mocked data for profiles who viewed the profile
const viewedProfiles = ref([
  { id: 1, name: 'Alice', gender: 'Female', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Bob', gender: 'Male', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Charlie', gender: 'Non-binary', image: 'https://via.placeholder.com/50' },
]);

const updateProfile = () => {
  console.log('Profile updated:', user.value);
};

const addInterest = () => {
  if (newInterest.value && !user.value.interests.includes(newInterest.value)) {
    user.value.interests.push(newInterest.value);
    newInterest.value = ''; // Clear the input
  }
};

const uploadImage = (index) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      gridImages.value[index] = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
};

const viewProfile = (profile) => {
  console.log('View profile clicked:', profile);
  // Here you can implement navigation to the profile details page
};
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.profile-page::-webkit-scrollbar {
  display: none;
}

.profile-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.profile-image {
  height: 50px;
  width: 50px;
  border-radius: 5px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}
.image-grid {
  margin-top: 30px;
}

.grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.grid-item {
  width: 100%;
  height: 100px;
  background-color: #e9ecef;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.svg-placeholder {
  width: 50%;
  height: auto;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: vertical;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.tag {
  background-color: #007bff;
  color: #fff;
  border-radius: 15px;
  padding: 5px 10px;
  margin: 5px;
}

.btn-update {
  grid-column: span 2;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-update:hover {
  background-color: #218838;
}

.profile-stats {
  margin-top: 30px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.viewed-profiles {
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  margin-top: 10px;
  border-top: 1px solid #ccc;
}

.profile-item {
  margin-right: 15px;
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  gap: 10px;
  white-space: nowrap;
}
</style>
