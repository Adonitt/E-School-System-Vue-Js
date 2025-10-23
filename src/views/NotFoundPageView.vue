<template>
  <div class="container text-center mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow p-4">
          <h1 class="display-1 text-danger">404</h1>
          <h3 class="mb-3">Oops! Page not found</h3>
          <p class="text-muted mb-4">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <router-link to="/" class="btn btn-primary btn-lg">
            Go Back Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.card {
  border-radius: 1rem;
}

.display-1 {
  font-size: 6rem;
  font-weight: bold;
}
</style>
