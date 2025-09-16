<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import AdminService from "@/services/adminService.js";
import {useRoute, useRouter} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";
import AdminListingView from "@/views/admin/AdminListingView.vue";
import AppButton from "@/components/app/AppButton.vue";
import {useAuthStore} from "@/stores/authStore.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Admin List', to: {name: 'admins'}},
  {label: 'Admin Details'}
]
const {withLoading} = useLoading()
const route = useRoute()
const router = useRouter()
const admin = ref()

const loadAdmin = async (id) => {
  await withLoading(async () => {
    admin.value = await AdminService.getAdminById(id)
  })
}

const toast = useAppToast()
const onDeleteAdmin = async (id) => {
  const result = await toast.showDialog("Are you sure you want to delete this admin?")
  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = AdminService.removeAdmin(id)
        toast.showSuccess("Admin with id: " + id + " deleted successfully")
        await router.push({name: 'admins'})
      })
    } catch (err) {
      throw err;
    }
  }
}

const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

const authStore = useAuthStore()

onMounted(() => {
  loadAdmin(route.params.id)
})
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <section class="section profile">
    <div>
      <div class="d-flex justify-content-center gap-2 m-3 ">
        <router-link class="btn btn-secondary  " :to="{name:'edit-admin', params:{id:route.params.id}}"
        >Update Admin
        </router-link>

        <button class="btn btn-danger flex" @click="onDeleteAdmin(admin.id) "
                v-if="authStore.loggedInUser.id !== +route.params.id"

        >Delete Admin
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
            <img
                :src="getFullImagePath(admin?.photo)"
                alt="Profile"
                class="rounded-circle"
                height="150"
                width="150"
            />
            <h2>{{ admin?.name + " " + admin?.surname }}</h2>
            <h3>{{ admin?.role }}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body profile-card pt-4 d-flex flex-column ">

            <div class="row">
              <div class="col-lg-5 col-md-4 label">Created By:</div>
              <div class="col-lg-7 col-md-8">{{ admin?.createdBy }}</div>

            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-md-4 label">Created At:</div>
              <div class="col-lg-7 col-md-8">{{ admin?.createdDate }}</div>
            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-md-4 label">Modified By</div>
              <div class="col-lg-7 col-md-8">{{ admin?.modifiedBy }}</div>
            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-md-4 label">Modified At</div>
              <div class="col-lg-7 col-md-8">{{ admin?.modifiedDate }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-8">
        <div class="card">
          <div class="card-body pt-3">
            <div class="tab-content pt-2">
              <div class="tab-pane fade profile-overview active show" id="profile-overview">
                <h5 class="card-title">Profile Details</h5>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Personal Number</div>
                  <div class="col-lg-9 col-md-8">{{ admin?.personalNumber }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Full Name</div>
                  <div class="col-lg-9 col-md-8">{{ admin?.name }} {{ admin?.surname }}</div>
                </div>


                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Gender</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.gender }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Birthdate</div>
                  <div class="col-lg-9 col-md-8">{{ admin?.birthDate }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Address</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.address }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">City</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.city }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Country</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.country }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Postal Code</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.postalCode }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Phone Number</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.phoneNumber }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Role</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.role }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Notes</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.notes }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Email</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.email }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Notes</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.notes }}</div>
                </div>


              </div>
              <hr>
              <div class="tab-pane fade profile-overview active show">
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Admin Number</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.adminNumber }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Department</div>
                  <div class="col-lg-9 col-md-8"> {{ admin?.department }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Is Active</div>
                  <div class="col-lg-9 col-md-8">
  <span
      class="badge"
      :class="admin?.active? 'bg-success' : 'bg-danger'">
    {{ admin?.active ? 'Yes' : 'No' }}
  </span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Accept Terms And Conditions</div>
                  <div class="col-lg-9 col-md-8">
  <span
      class="badge"
      :class="admin?.acceptTermsAndConditions ? 'bg-success' : 'bg-danger'">
    {{ admin?.acceptTermsAndConditions ? 'Yes' : 'No' }}
  </span>
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

<style scoped>

</style>