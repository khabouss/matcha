<template>
  <div class="complete-profile-container">
    <!-- Left side - Image -->
    <div class="image-section">
      <div class="overlay"></div>
      <div class="content">
        <h1>Complete Your Profile</h1>
        <p>Tell us about yourself to start your journey to find love</p>
      </div>
    </div>

    <!-- Right side - Form -->
    <div class="form-section">
      <div class="form-container">
        <div class="logo">
          <h2>Matcha <i class="fas fa-heart"></i></h2>
        </div>

        <div class="welcome-text">
          <h3>Let's Get Started!</h3>
          <p>Add your photos and preferences to create your perfect profile</p>
        </div>

        <form class="profile-form" @submit.prevent="updateProfile">
          <!-- Photos Section -->
          <div class="form-card">
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

          <!-- Preferences -->
          <div class="form-card">
            <h2>Preferences</h2>
            <div class="form-grid">
              <div class="form-group">
                <div class="input-wrapper">
                  <select v-model="user.gender" id="gender" required>
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <label for="gender">Gender</label>
                  <i class="fas fa-venus-mars"></i>
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <select v-model="user.sexual_preferences" id="sexual_preferences" required>
                    <option value="">Select preference</option>
                    <option value="heterosexual">Heterosexual</option>
                    <option value="homosexual">Homosexual</option>
                    <option value="bisexual">Bisexual</option>
                    <option value="pansexual">Pansexual</option>
                    <option value="asexual">Asexual</option>
                  </select>
                  <label for="sexual_preferences">Looking For</label>
                  <i class="fas fa-heart"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- About Me -->
          <div class="form-card">
            <h2>About Me</h2>
            <div class="form-group">
              <div class="input-wrapper">
                <textarea 
                  v-model="user.biography" 
                  id="biography" 
                  placeholder=" "
                  rows="4"
                  required
                ></textarea>
                <label for="biography">Biography</label>
                <i class="fas fa-user-edit"></i>
              </div>
            </div>
          </div>

          <!-- Interests -->
          <div class="form-card">
            <h2>Interests</h2>
            <div class="form-group">
              <div class="interest-input">
                <div class="input-wrapper">
                  <input 
                    v-model="newInterest" 
                    @keyup.enter="addInterest" 
                    placeholder=" "
                    type="text"
                    id="interest"
                  />
                  <label for="interest">Add an interest</label>
                  <i class="fas fa-tags"></i>
                </div>
                <button type="button" class="add-interest" @click="addInterest">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="interests-cloud">
                <div v-for="interest in user.interests" 
                     :key="interest" 
                     class="interest-tag">
                  <span>#{{ interest }}</span>
                  <button type="button" class="remove-interest" @click="removeInterest(interest)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="complete-button"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Complete Profile</span>
            <div v-else class="spinner"></div>
          </button>
        </form>
      </div>
    </div>
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
const gridImages = ref(Array(5).fill(null));
const uploadedImages = ref(Array(5).fill(null));
const presignedUrls = ref(Array(5).fill(null));

const uploadImage = (index) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Get the token from cookie instead of localStorage
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
          const uploadUrl = response.data.uploadUrl;

          // Upload the file with proper headers and CORS mode
          const uploadResponse = await fetch(uploadUrl, {
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

          if (uploadResponse.ok) {
            uploadedImages.value[index] = file;
            gridImages.value[index] = URL.createObjectURL(file);
          } else {
            console.error('Upload failed:', await uploadResponse.text());
          }
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

const addInterest = () => {
  if (newInterest.value && !user.value.interests.includes(newInterest.value)) {
    user.value.interests.push(newInterest.value);
    newInterest.value = '';
  }
};

const removeInterest = (interest) => {
  user.value.interests = user.value.interests.filter(i => i !== interest);
};

const updateProfile = async () => {
  const profileData = {
    gender: user.value.gender,
    sexual_preferences: user.value.sexual_preferences,
    biography: user.value.biography,
    interests: user.value.interests,
    images: presignedUrls.value
      .filter((url) => url !== null)
      .map((url) => {
        const slashIndex = url.indexOf('/', 8);
        return slashIndex !== -1 ? url.slice(slashIndex + 1) : '';
      })
  }

  try {
    const { data, error } = await useCFetch('http://localhost:3001/profile', {
      method: 'POST',
      body: profileData,
    });

    if (error.value) {
      alert('Error updating profile', error.value);
    } else {
      console.log('Profile updated successfully', data.value);
      window.location.href = '/'
    }
  } catch (err) {
    console.error('Error during profile update', err);
  }
};
</script>

<style scoped>
.complete-profile-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

/* Image Section */
.image-section {
  flex: 1;
  background-image: url('/matching-couples.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  display: none;
}

@media (min-width: 1024px) {
  .image-section {
    display: block;
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.5)
  );
}

.image-section .content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
}

.image-section h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.image-section p {
  font-size: 1.25rem;
  max-width: 80%;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
}

/* Form Section */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #ffffff;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 600px;
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo h2 {
  font-size: 2rem;
  color: #1a1a1a;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.logo i {
  color: #ff4b6e;
}

.welcome-text {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-text h3 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.welcome-text p {
  color: #666;
}

/* Form Cards */
.form-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.form-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.section-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

/* Form Elements */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input,
.input-wrapper select,
.input-wrapper textarea {
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.input-wrapper textarea {
  min-height: 120px;
  resize: vertical;
}

.input-wrapper input:focus,
.input-wrapper select:focus,
.input-wrapper textarea:focus {
  border-color: #3b82f6;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper label {
  position: absolute;
  left: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-wrapper textarea + label {
  top: 1rem;
  transform: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label,
.input-wrapper select:focus + label,
.input-wrapper select:not(:placeholder-shown) + label,
.input-wrapper textarea:focus + label,
.input-wrapper textarea:not(:placeholder-shown) + label {
  top: 0;
  left: 1rem;
  font-size: 0.875rem;
  padding: 0 0.25rem;
  background-color: #ffffff;
  color: #3b82f6;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.input-wrapper textarea + i {
  top: 1rem;
  transform: none;
}

/* Photo Grid */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 0.75rem;
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
  gap: 0.5rem;
}

.upload-placeholder i {
  font-size: 1.5rem;
}

/* Interests */
.interest-input {
  display: flex;
  gap: 0.5rem;
}

.interest-input .input-wrapper {
  flex: 1;
}

.add-interest {
  padding: 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-interest:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.interests-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.interest-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
  border-radius: 1rem;
  color: #3b82f6;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.interest-tag:hover {
  background: #e0e7ff;
}

.remove-interest {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.remove-interest:hover {
  color: #ef4444;
}

/* Complete Button */
.complete-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #ff4b6e, #ff6b8b);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
}

.complete-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 75, 110, 0.2);
}

.complete-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-container {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .complete-profile-container {
    flex-direction: column;
  }

  .form-section {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }
}
</style>