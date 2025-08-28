<script setup>
import {useAuthStore} from "@/stores/authStore.js";
import {useRoute, useRouter} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useAppToast()

const onLogout = () => {
  authStore.logout()
  router.push({name: 'login'})
  toast.showSuccess("You have been logged out successfully!")

}
console.log(authStore.loggedInUser)

</script>

<template>
  <header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
      <router-link :to="{name:'home'}" class="logo d-flex align-items-center">
        <img src="../../assets/img/schicon.png" alt="School Icon" style="width: 30px;height:30px"/>
        <span class="d-none d-lg-block">E-School System</span>
      </router-link>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div>


    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">

        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li>

        <li class="nav-item dropdown">

          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <span class="badge bg-primary badge-number">4</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li class="dropdown-header">
              You have 4 new notifications
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>


            <li class="notification-item">
              <i class="bi bi-info-circle text-primary"></i>
              <div>
                <h4>Dicta reprehenderit</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>4 hrs. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

          </ul>
        </li>


        <li class="nav-item dropdown pe-3">

          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <!--            <img src="../../assets/img/messages-2.jpg" alt="Profile" class="rounded-circle">-->
            {{ authStore.loggedInUser?.fullName }}
            <span class="d-none d-md-block dropdown-toggle ps-2">
              </span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li class="dropdown-header">
              <h6> {{ authStore.loggedInUser?.fullName }}
              </h6>
              <span>{{ authStore.loggedInUser?.role }}</span>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <router-link :to="{name:'my-profile'}" class="dropdown-item d-flex align-items-center" href="#">
                <i class="bi bi-person"></i>
                <span>My Profile</span>
              </router-link>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="#">
                <i class="bi bi-gear"></i>
                <span>Account Settings</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="#">
                <i class="bi bi-question-circle"></i>
                <span>Need Help?</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" @click="onLogout">
                <i class="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </a>
            </li>

          </ul>
        </li>

      </ul>
    </nav>

  </header>
</template>

<style scoped>

</style>