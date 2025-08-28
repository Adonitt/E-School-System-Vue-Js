<script setup>
import {ref, onMounted, computed} from "vue";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useAuthStore} from "@/stores/authStore.js";
import AdminService from "@/services/adminService.js";
import TeacherService from "@/services/teacherService.js";
import StudentService from "@/services/studentService.js";
import SubjectService from "@/services/subjectService.js";

const breadcrumbs = [
  {label: "Dashboard", to: {name: "home"}},
  {label: "My Profile"},
];

const authStore = useAuthStore();
const profile = ref(null);
const subjectNames = ref([])

const getFullPath = (path) => {
  if (!path || typeof path !== "string") return null;
  const baseUrl = "http://localhost:8080/";
  return baseUrl + path;
}

const photoUrl = computed(() => {
  return profile.value?.photo ? getFullPath(profile.value.photo) : null;
})


onMounted(async () => {
  try {
    if (authStore.loggedInUser.role === "ADMINISTRATOR") {
      profile.value = await AdminService.getAdminById(authStore.loggedInUser.id);
    } else if (authStore.loggedInUser.role === "TEACHER") {
      profile.value = await TeacherService.getTeacherById(authStore.loggedInUser.id);
    } else {
      profile.value = await StudentService.getStudentById(authStore.loggedInUser.id);
    }

    if (profile.value.subjectIds && profile.value.subjectIds.length > 0) {
      const allSubjects = await SubjectService.getAllSubjects();
      subjectNames.value = allSubjects
          .filter(s => profile.value.subjectIds.includes(s.id))
          .map(s => s.name);
    }
  } catch (e) {
    console.error("Error loading profile:", e);
  }
});
console.log(profile)
</script>


<template>
  <bread-crumb :items="breadcrumbs"/>

  <section class="section profile">
    <div class="row">
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
            <img
                :src="photoUrl"
                alt="Profile"
                class="rounded-circle"
                height="150"
                width="150"
            />
            <h2>{{ authStore.loggedInUser.fullName }}</h2>
            <h3>{{ profile?.role }}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body profile-card pt-4 d-flex flex-column ">

            <div class="row">
              <div class="col-lg-5 col-md-4 label">Created By:</div>
              <div class="col-lg-7 col-md-8">{{ profile?.createdBy }}</div>

            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-md-4 label">Created At:</div>
              <div class="col-lg-7 col-md-8">{{ profile?.createdDate }}</div>
            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-md-4 label">Modified By</div>
              <div class="col-lg-7 col-md-8">{{ profile?.modifiedBy }}</div>
            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-md-4 label">Modified At</div>
              <div class="col-lg-7 col-md-8">{{ profile?.modifiedDate }}</div>
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
                  <div class="col-lg-9 col-md-8">{{ profile?.personalNumber }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Full Name</div>
                  <div class="col-lg-9 col-md-8">{{ profile?.name }} {{ profile?.surname }}</div>
                </div>


                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Gender</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.gender }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Birthdate</div>
                  <div class="col-lg-9 col-md-8">{{ profile?.birthDate }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Address</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.address }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">City</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.city }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Country</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.country }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Postal Code</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.postalCode }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Phone Number</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.phoneNumber }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Role</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.role }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Notes</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.notes }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Email</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.email }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Notes</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.notes }}</div>
                </div>


              </div>
              <hr>
              <div v-if="authStore.loggedInUser.role === 'ADMINISTRATOR'"
                   class="tab-pane fade profile-overview active show">
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Admin Number</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.adminNumber }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Department</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.department }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Is Active</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.active }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Accept Terms And Conditions</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.acceptTermsAndConditions }}</div>
                </div>
              </div>
              <div v-if="authStore.loggedInUser.role === 'TEACHER'"
                   class="tab-pane fade profile-overview active show">
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Specialization</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.specialization }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Years Of Experience</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.yearsOfExperience }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Employment Date</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.employmentDate }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Qualification</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.qualification }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Subjects</div>
                  <div class="col-lg-9 col-md-8">
                    <ol>
                      <li v-for="(name, index) in subjectNames" :key="index">
                        {{ name }}
                      </li>
                    </ol>
                  </div>
                </div>


              </div>
              <div v-if="authStore.loggedInUser.role === 'STUDENT'"
                   class="tab-pane fade profile-overview active show">
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Registered Date</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.registeredDate }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Academic Year</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.academicYear }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Class Number</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.classNumber }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Current Semester</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.currentSemester }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Completed Semesters</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.completedSemesters }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Graduated?</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.graduated }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Is Active Student?</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.active }}</div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Guardian Name</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.guardianName }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Guardian Phone Number</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.guardianPhoneNumber }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Guardian Email</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.guardianEmail }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Relationship To Student</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.relationshipToStudent }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Emergency Contact Phone</div>
                  <div class="col-lg-9 col-md-8"> {{ profile?.emergencyContactPhone }}</div>
                </div>

              </div>
            </div>
            <a class="btn btn-primary">Change Password</a>
          </div>
        </div>
      </div>
    </div>

  </section>

</template>


<style scoped>

</style>