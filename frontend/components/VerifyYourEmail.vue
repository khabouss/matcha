<template>
    <div class="verify-email-container">
        <h2>Verify Your Email</h2>
        <p>
            We’ve sent an email to <strong>{{ email }}</strong>. Please check your inbox and click on the verification
            link to activate your account.
        </p>
    </div>
</template>

<script>
</script>

<style scoped>
h2 {
    margin-bottom: 1rem;
}

p {
    margin-bottom: 1rem;
}

.verify-email-container {
    text-align: center;
    padding: 20px;
    max-width: 400px;
    margin: 0 auto;
}

button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

button:disabled {
    background-color: #ccc;
}

.success-message {
    color: green;
    margin-top: 10px;
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>