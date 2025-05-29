<template>
  <NuxtLayout>
    <div class="modern-profile">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="header-content">
          <h1>Edit Profile</h1>
          <p class="subtitle">Make your profile stand out</p>
        </div>
        <button class="save-button" @click="updateProfile">
          <i class="fas fa-save"></i>
          Save Changes
        </button>
      </div>

      <!-- Main Content -->
      <div class="profile-content">
        <!-- Left Column - Photos -->
        <div class="photos-section">
          <h2>Profile Photos</h2>
          <p class="section-subtitle">Add up to 5 photos to showcase yourself</p>
          
          <div class="photo-grid">
            <div v-for="(image, index) in gridImages" 
                 :key="index" 
                 class="photo-item"
                 :class="{ 'has-image': image }"
                 @click="uploadImage(index)">
              <template v-if="image">
                <img :src="image" alt="Profile photo" />
                <div class="photo-overlay">
                  <i class="fas fa-camera"></i>
                  <span>Change</span>
                </div>
              </template>
              <template v-else>
                <div class="upload-placeholder">
                  <i class="fas fa-plus"></i>
                  <span>Add Photo</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Right Column - Profile Info -->
        <div class="info-section">
          <!-- Basic Info -->
          <div class="info-card">
            <h2>Basic Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="first_name">First Name</label>
                <input 
                  v-model="user.first_name" 
                  type="text" 
                  id="first_name" 
                  placeholder="Your first name"
                  required 
                />
              </div>

              <div class="form-group">
                <label for="last_name">Last Name</label>
                <input 
                  v-model="user.last_name" 
                  type="text" 
                  id="last_name" 
                  placeholder="Your last name"
                  required 
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  v-model="user.email" 
                  type="email" 
                  id="email" 
                  placeholder="your.email@example.com"
                  required 
                />
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="info-card">
            <h2>Preferences</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="gender">Gender</label>
                <select v-model="user.gender" id="gender" required>
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="sexual_preferences">Looking For</label>
                <select v-model="user.sexual_preferences" id="sexual_preferences" required>
                  <option value="">Select preference</option>
                  <option value="heterosexual">Heterosexual</option>
                  <option value="homosexual">Homosexual</option>
                  <option value="bisexual">Bisexual</option>
                  <option value="pansexual">Pansexual</option>
                  <option value="asexual">Asexual</option>
                </select>
              </div>
            </div>
          </div>

          <!-- About Me -->
          <div class="info-card">
            <h2>About Me</h2>
            <div class="form-group">
              <label for="biography">Biography</label>
              <textarea 
                v-model="user.biography" 
                id="biography" 
                placeholder="Tell us about yourself..."
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <!-- Interests -->
          <div class="info-card">
            <h2>Interests</h2>
            <div class="form-group">
              <div class="interest-input">
                <input 
                  v-model="newInterest" 
                  @keyup.enter="addInterest" 
                  placeholder="Add an interest and press Enter"
                  type="text"
                />
                <button class="add-interest" @click="addInterest">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="interests-cloud">
                <div v-for="interest in user.interests" 
                     :key="interest" 
                     class="interest-tag">
                  <span>#{{ interest }}</span>
                  <button class="remove-interest" @click="removeInterest(interest)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Stats -->
      <div class="stats-section">
        <div class="stats-header">
          <h2>Profile Statistics</h2>
          <div class="stats-summary">
            <div class="stat-item">
              <i class="fas fa-heart"></i>
              <div class="stat-info">
                <span class="stat-value">{{ likes.length }}</span>
                <span class="stat-label">Likes</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-star"></i>
              <div class="stat-info">
                <span class="stat-value">{{ fameRating }}</span>
                <span class="stat-label">Fame Rating</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Liked By Section -->
        <div class="liked-by-section">
          <h3>People Who Liked You</h3>
          <div class="liked-by-grid">
            <div v-for="profile in likedByProfiles" 
                 :key="profile.username" 
                 class="liked-by-card"
                 @click="viewProfile(profile)">
              <div class="liked-by-image">
                <img :src="'http://localhost:4566/'+profile.profileImage" :alt="profile.first_name" />
              </div>
              <div class="liked-by-info">
                <h4>{{ profile.first_name }} {{ profile.last_name }}</h4>
                <span class="liked-by-gender">{{ profile.gender }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Viewers Section -->
        <div class="viewers-section">
          <h3>Recent Profile Views</h3>
          <div class="viewers-grid">
            <div v-for="profile in viewedProfiles" 
                 :key="profile.username" 
                 class="viewer-card"
                 @click="viewProfile(profile)">
              <div class="viewer-image">
                <img :src="'http://localhost:3001/'+profile.profileImage" :alt="profile.first_name" />
              </div>
              <div class="viewer-info">
                <h4>{{ profile.first_name }} {{ profile.last_name }}</h4>
                <span class="viewer-gender">{{ profile.gender }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { data, error } = await useCFetch('http://localhost:3001/profile/me', {
  method: 'GET',
});

const presignedUrls = ref(Array(5).fill(null));

const user = ref({
  first_name: data.value.data.data.getProfile.userinfo.first_name,
  last_name: data.value.data.data.getProfile.userinfo.last_name,
  email: data.value.data.data.getProfile.userinfo.email,
  gender: data.value.data.data.getProfile.gender,
  sexual_preferences: data.value.data.data.getProfile.sexual_preferences,
  biography: data.value.data.data.getProfile.biography,
  interests: [],
});

const newInterest = ref('');
const likes = ref([]);
const fameRating = ref(0);
const likedByProfiles = ref([]);

const images = data.value.data.data.getProfile.images.map(
  path => `http://localhost:4566/${path}`
);

while (images.length < 5) {
  images.push(null);
}

const uploadedImages = ref(Array(5).fill(null));
const gridImages = ref(images);
const viewedProfiles = ref(data.value.data.data.views);

const updateProfile = async () => {
  // Format the data according to backend expectations
  const profileData = {
    first_name: user.value.first_name,
    last_name: user.value.last_name,
    email: user.value.email,
    gender: user.value.gender,
    sexual_preferences: user.value.sexual_preferences,
    biography: user.value.biography,
    interests: user.value.interests || [],
    images: presignedUrls.value
      .filter((url) => url !== null)
      .map((url) => {
        const slashIndex = url.indexOf('/', 8);
        return slashIndex !== -1 ? url.slice(slashIndex + 1) : '';
      }),
    // Add default values for required fields
    fame_rating: 0.0,
    gps_location: null,
    neighborhood: null,
    allow_gps: true
  };

  try {
    // Get the token from cookie
    const token = useCookie('access_token').value;
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    console.log('Sending profile data:', profileData); // Debug log

    const response = await $fetch('http://localhost:3001/profile/me', {
      method: 'PATCH',
      body: profileData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response?.status === 'success') {
      console.log('Profile updated successfully', response);
      window.location.href = '/profile';
    } else {
      console.error('Error updating profile:', response);
      alert('Failed to update profile. Please try again.');
    }
  } catch (err) {
    console.error('Error during profile update:', err);
    if (err.response?.status === 400) {
      const errorMessage = err.response._data?.error_message || 'Invalid profile data. Please check your inputs.';
      console.error('Validation error:', errorMessage);
      alert(errorMessage);
    } else {
      alert('An error occurred while updating your profile. Please try again.');
    }
  }
};

const addInterest = () => {
  if (newInterest.value && !user.value.interests.includes(newInterest.value)) {
    user.value.interests.push(newInterest.value);
    newInterest.value = '';
  }
};

const removeInterest = (interest) => {
  user.value.interests = user.value.interests.filter(i => i !== interest);
};

const uploadImage = (index) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Get the token from cookie
        const token = useCookie('access_token').value;
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const response = await $fetch('http://localhost:3001/upload/s3/presigned-url', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response?.data?.uploadUrl) {
          presignedUrls.value[index] = response.data.fileUrl;

          // Upload the file with proper headers
          await $fetch(response.data.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
              'x-amz-acl': 'public-read',
              'Origin': 'http://localhost:3002'
            },
            mode: 'cors',
            credentials: 'omit'
          });

          uploadedImages.value[index] = file;
          gridImages.value[index] = URL.createObjectURL(file);
        } else {
          console.error('Error fetching presigned URL:', response);
        }
      } catch (err) {
        console.error('Error during image upload:', err);
      }
    }
  };
  input.click();
};

const viewProfile = (profile) => {
  useRoute().push('/'+profile.username);
};

// Fetch profiles that have liked the current user
const fetchLikedByProfiles = async () => {
  try {
    const response = await $fetch('http://localhost:3001/like/liked', {
      headers: {
        'Authorization': `Bearer ${useCookie('access_token').value}`
      }
    });

    if (response.status === 'success') {
      likedByProfiles.value = response.data.map(profile => ({
        ...profile,
        profileImage: profile.images?.[0] || 'test-bucket/default-avatar.svg'
      }));
    }
  } catch (error) {
    console.error('Error fetching liked by profiles:', error);
  }
};

// Call fetchLikedByProfiles when component mounts
onMounted(() => {
  fetchLikedByProfiles();
});
</script>

<style scoped>
.modern-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header Styles */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.subtitle {
  color: #64748b;
  margin: 4px 0 0 0;
}

.save-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Main Content Layout */
.profile-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* Photos Section */
.photos-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.photos-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.section-subtitle {
  color: #64748b;
  margin: 0 0 20px 0;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: #f1f5f9;
  border: 2px dashed #cbd5e1;
  transition: all 0.3s ease;
}

.photo-item.has-image {
  border: none;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  gap: 8px;
}

.upload-placeholder i {
  font-size: 1.5rem;
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.info-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
  color: #4b5563;
}

input,
select,
textarea {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Interests */
.interest-input {
  display: flex;
  gap: 8px;
}

.interest-input input {
  flex: 1;
}

.add-interest {
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-interest:hover {
  background: #2563eb;
}

.interests-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.interest-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  color: #3b82f6;
  font-size: 0.9rem;
}

.remove-interest {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.remove-interest:hover {
  color: #ef4444;
}

/* Stats Section */
.stats-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stats-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.stats-summary {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-item i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.liked-by-section {
  margin-top: 24px;
  margin-bottom: 24px;
}

.liked-by-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.liked-by-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.liked-by-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.liked-by-card:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.liked-by-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
}

.liked-by-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.liked-by-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.liked-by-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.liked-by-gender {
  font-size: 0.8rem;
  color: #64748b;
}

.viewers-section {
  margin-top: 24px;
}

.viewers-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.viewers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.viewer-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.viewer-card:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.viewer-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
}

.viewer-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.viewer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.viewer-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.viewer-gender {
  font-size: 0.8rem;
  color: #64748b;
}

@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modern-profile {
    padding: 16px;
  }

  .profile-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .stats-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stats-summary {
    width: 100%;
    justify-content: center;
  }

  .viewers-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .liked-by-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
