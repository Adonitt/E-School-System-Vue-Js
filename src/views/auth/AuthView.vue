<script setup>
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import {reactive, ref} from "vue";
import {useAppToast} from "@/composables/useAppToast.js";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore()
const toast = useAppToast()

const user = reactive({
  email: '',
  password: ''
})
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!user.email || !user.password) {
    toast.showWarning("Please fill all fields!");
    return
  }
  try {
    isLoading.value = true
    const response = await authStore.login(user)
    const redirect = route.query.redirect || {name: 'home'}
    await router.push(redirect)

  } catch (error) {
    toast.showError(error.response?.data || 'An error has occurred!');
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>

  <div class="container">

    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

            <div class="d-flex justify-content-center py-4">
              <p class="logo d-flex align-items-center w-auto">
                <img src="../../assets/img/schicon.png" alt="School Icon" style="width: 30px;height:30px">
                <span class="d-none d-lg-block">E-School System</span>
              </p>
            </div>

            <div class="card mb-3">
              <div class="card-body">
                <div class="pt-4 pb-2">
                  <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                  <p class="text-center small">Enter your email & password to login</p>
                </div>


                <form @submit.prevent="handleSubmit" class="row g-3 needs-validation">
                  <div class="col-12">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-group has-validation">
                      <input type="email"
                             v-model.trim="user.email"
                             class="form-control"
                             placeholder="Enter your email"
                             required>
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control"
                           placeholder="Enter your password"
                           v-model.trim="user.password"
                           required>

                  </div>
<!--                  <a href="#">Forgot Password</a>-->
<br>
                  <div class="col-12">
                    <button class="btn btn-primary w-100" type="submit">Login</button>
                  </div>
                </form>

              </div>
            </div>


          </div>
        </div>
      </div>

    </section>

  </div>
</template>

<style scoped>

</style>