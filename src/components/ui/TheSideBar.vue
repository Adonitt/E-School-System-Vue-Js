<script setup>
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";

const authStore = useAuthStore()
const props = defineProps({
  isOpen: {type: Boolean, default: true}
});
const emit = defineEmits(['close']);

const onLinkClick = () => {
  if (window.innerWidth < 992) emit('close');
}
</script>

<template>
  <aside :class="['sidebar', { 'sidebar-open': isOpen, 'sidebar-collapsed': !isOpen }]">

    <ul class="sidebar-nav" id="sidebar-nav">

      <li class="nav-item">
        <router-link :to="{name:'home'}" class="nav-link" @click="onLinkClick">
          <i class="bi bi-grid"></i>
          <span>Dashboard</span>
        </router-link>
      </li>

      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-menu-button-wide"></i><span>Administration</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="components-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <router-link :to="{name:'admins'}" @click="onLinkClick"
                         v-if="authStore.loggedInUser?.role === ROLES.ADMIN || authStore.loggedInUser?.role === ROLES.TEACHER"

            >
              <i class="bi bi-person"></i>
              <span>Admins</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'teachers'}" @click="onLinkClick">
              <i class="bi bi-pen"></i><span>Teachers</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'students'}" @click="onLinkClick">
              <i class="bi bi-person-badge-fill"></i><span>Students</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li class="nav-item ">
        <router-link :to="{name:'subjects'}" class="nav-link collapsed" @click="onLinkClick">
          <i class="bi bi-newspaper"></i>
          <span>Subjects</span>
        </router-link>
      </li>

      <li class="nav-item "
          v-if="authStore.loggedInUser?.role === ROLES.STUDENT">
        <router-link :to="{name:'student-subjects', params:{id:authStore.loggedInUser?.id}}" @click="onLinkClick"
                     class="nav-link collapsed">
          <i class="bi bi-journal-text"></i>
          <span>My Subjects</span>
        </router-link>
      </li>

      <li class="nav-item "
          v-if="authStore.loggedInUser?.role === ROLES.ADMIN || authStore.loggedInUser?.role === ROLES.TEACHER">
        <router-link :to="{name:'attendance'}" class="nav-link collapsed" @click="onLinkClick">
          <i class="bi bi-journal-text"></i>
          <span>Attendances</span>
        </router-link>
      </li>
      <li class="nav-item "
          v-if="authStore.loggedInUser?.role === ROLES.ADMIN || authStore.loggedInUser?.role === ROLES.TEACHER">

        <router-link :to="{name:'grades'}" class="nav-link collapsed" @click="onLinkClick">
          <i class="bi-sort-numeric-up-alt"></i>
          <span>Grades</span>
        </router-link>
      </li>

      <li class="nav-item "
          v-if="authStore.loggedInUser?.role === ROLES.STUDENT">
        <router-link :to="{name:'student-grades', params:{id:authStore.loggedInUser?.id}}" class="nav-link collapsed"
                     @click="onLinkClick">
          <i class="bi-sort-numeric-up-alt"></i>
          <span>My Grades</span>
        </router-link>
      </li>
      <li class="nav-item "
          v-if="authStore.loggedInUser?.role === ROLES.STUDENT">
        <router-link :to="{name:'student-attendances', params:{id:authStore.loggedInUser?.id}}" @click="onLinkClick"
                     class="nav-link collapsed">
          <i class="bi bi-journal-text"></i>
          <span>My Attendances</span>
        </router-link>
      </li>


      <li class="nav-item ">
        <router-link :to="{name:'my-profile'}" class="nav-link collapsed" @click="onLinkClick">
          <i class="bi bi-person"></i>
          <span>My Profile</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100% - 60px);
  background-color: #fff;
  transition: transform 0.3s ease;
  z-index: 999;
}

.sidebar-collapsed {
  transform: translateX(-100%);
}

.sidebar-open {
  transform: translateX(0);
}

@media (min-width: 992px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}
</style>