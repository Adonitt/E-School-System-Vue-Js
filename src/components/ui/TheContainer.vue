<script setup >
import {useAuthStore} from "@/stores/authStore.js";


</script>

<template>

  <div class="pagetitle">
    <h1>Dashboard</h1>
    <!--      <nav>-->
    <!--        <ol class="breadcrumb">-->
    <!--          <li class="breadcrumb-item"><a href="index.html">Home</a></li>-->
    <!--          <li class="breadcrumb-item active">Dashboard</li>-->
    <!--        </ol>-->
    <!--      </nav>-->
  </div>

  <section class="section dashboard">
    <div class="row">

      <div class="col-lg-8">
        <div class="row">


          <div class="col-xxl-4 col-md-6">
            <div class="card info-card sales-card">

              <div class="card-body">
                <h5 class="card-title">Admins </h5>

                <div class="d-flex align-items-center">
                  <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i class="bi bi-person"></i>
                  </div>
                  <div class="ps-3">
                    <h6>145</h6>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="col-xxl-4 col-md-6">
            <div class="card info-card sales-card">

              <div class="card-body">
                <h5 class="card-title">Teachers </h5>

                <div class="d-flex align-items-center">
                  <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i class="bi bi-pen"></i>
                  </div>
                  <div class="ps-3">
                    <h6>145</h6>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="col-xxl-4 col-md-6">
            <div class="card info-card sales-card">

              <div class="card-body">
                <h5 class="card-title">Students </h5>

                <div class="d-flex align-items-center">
                  <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i class="bi bi-person-badge-fill"></i>
                  </div>
                  <div class="ps-3">
                    <h6>145</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
