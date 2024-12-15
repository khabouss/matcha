<template>
  <div class="profile-page">
    <header class="header">
      <h1>Please complete your profile to continue</h1>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="svg-placeholder">
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
          <label for="gender">Gender:</label>
          <select v-model="user.gender" id="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="sexual_preferences">Sexual Preferences:</label>
          <select v-model="user.sexual_preferences" id="sexual_preferences" required>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';

const user = ref({
  gender: '',
  sexual_preferences: '',
  biography: '',
  interests: [],
});

const newInterest = ref('');
const gridImages = ref(Array(5).fill(null)); // Array to hold image file URLs
const uploadedImages = ref(Array(5).fill(null)); // Array to hold image file objects

const uploadImage = (index) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadedImages.value[index] = file;
      gridImages.value[index] = URL.createObjectURL(file);
    }
  };
  input.click();
};

const addInterest = () => {
  if (newInterest.value.trim()) {
    user.value.interests.push(newInterest.value.trim());
    newInterest.value = '';
  }
};

const updateProfile = async () => {
  const formData = new FormData();

  // Add stringified JSON data
  const profileData = {
    gender: user.value.gender,
    sexual_preferences: user.value.sexual_preferences,
    biography: user.value.biography,
    fame_rating: 4.5, // Default fame rating
    gps_location: {
      lat: 34.0522,
      lng: -118.2437,
    },
    neighborhood: 'casa LA',
    allow_gps: true, // Example value
    interests: user.value.interests,
  };

  formData.append('profile', JSON.stringify(profileData));

  formData.append(`files`, uploadedImages.value);

  try {
    const {data, error} = await useCFetch('http://localhost:3001/profile', { method: 'POST', body: profileData });
    console.log(data?.value);
    console.log(error?.value);
  } catch (error) {
    console.error(error);
  }
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
  height: 100vh;
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