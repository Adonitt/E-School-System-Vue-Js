<script setup lang="ts">

</script>

<template>
  <aside id="sidebar" class="sidebar">

    <ul class="sidebar-nav" id="sidebar-nav">

      <li class="nav-item">
        <router-link :to="{name:'home'}" class="nav-link">
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
            <router-link :to="{name:'admins'}">
              <i class="bi bi-person"></i>
              <span>Admins</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'teachers'}">
              <i class="bi bi-pen"></i><span>Teachers</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'students'}">
              <i class="bi bi-person-badge-fill"></i><span>Students</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li class="nav-item ">
        <router-link :to="{name:'subjects'}" class="nav-link collapsed">
          <i class="bi bi-newspaper"></i>
          <span>Subjects</span>
        </router-link>
      </li>

      <li class="nav-item ">
        <router-link :to="{name:'attendance'}" class="nav-link collapsed">
          <i class="bi bi-journal-text"></i>
          <span>Attendances</span>
        </router-link>
      </li>
      <li class="nav-item ">
        <router-link :to="{name:'grades'}" class="nav-link collapsed">
          <i class="bi-sort-numeric-up-alt"></i>
          <span>Grades</span>
        </router-link>
      </li>

      <li class="nav-item ">
        <router-link :to="{name:'my-profile'}" class="nav-link collapsed">
          <i class="bi bi-person"></i>
          <span>My Profile</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<style scoped>

</style>