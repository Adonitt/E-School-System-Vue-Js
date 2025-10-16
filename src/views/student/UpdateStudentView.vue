<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import UserUpdateForm from "@/components/user-form/UserUpdateForm.vue";
import {onMounted, ref} from "vue";
import AppSelect from "@/components/app/AppSelect.vue";
import AppInput from "@/components/app/AppInput.vue";
import {useLoading} from "@/composables/useLoading.js";
import StudentService from "@/services/studentService.js";
import {useEnumStore} from "@/stores/enumStore.js";
import {useAppToast} from "@/composables/useAppToast.js";
import {useRoute, useRouter} from "vue-router";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Student List', to: {name: 'students'}},
  {label: 'Update Student'}
]
const studentExtra = ref({
  photo: null,
  previewImage: null,
  academicYear: null,
  guardianName: '',
  guardianPhoneNumber: '',
  guardianEmail: '',
  emergencyContactPhone: '',
  relationshipToStudent: null,
  classNumber: 0
})

const guardianEnum = [
  {label: 'Father', value: 'FATHER'},
  {label: 'Mother', value: 'MOTHER'},
  {label: 'Uncle', value: 'UNCLE'},
  {label: 'Aunt', value: 'AUNT'},
  {label: 'Grandfather', value: 'GRANDFATHER'},
  {label: 'Grandmother', value: 'GRANDMOTHER'},
  {label: 'Other', value: 'OTHER'}
]

const userFormRef = ref(null);
const student = ref(null);
const {withLoading} = useLoading()
const enumStore = useEnumStore()

const {showError, showSuccess} = useAppToast()
const router = useRouter();
const route = useRoute()
const studentId = +route.params.id;

const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

const loadStudentById = async (id) => {
  await withLoading(async () => {
    student.value = await StudentService.getStudentById(id)

    userFormRef.value.user.personalNumber = student.value.personalNumber;
    userFormRef.value.user.name = student.value.name;
    userFormRef.value.user.surname = student.value.surname;
    userFormRef.value.user.gender = student.value.gender;
    userFormRef.value.user.birthDate = student.value.birthDate;
    userFormRef.value.user.address = student.value.address;

    await enumStore.loadCountries();
    userFormRef.value.user.country = student.value.country;

    await enumStore.loadCities(student.value.country);
    userFormRef.value.user.city = student.value.city;

    userFormRef.value.user.postalCode = student.value.postalCode;
    userFormRef.value.user.phoneNumber = student.value.phoneNumber;
    userFormRef.value.user.email = student.value.email;
    userFormRef.value.user.notes = student.value.notes;

    studentExtra.value.academicYear = student.value.academicYear;
    studentExtra.value.classNumber = student.value.classNumber;
    studentExtra.value.active = student.value.active;
    studentExtra.value.guardianName = student.value.guardianName;
    studentExtra.value.guardianPhoneNumber = student.value.guardianPhoneNumber;
    studentExtra.value.guardianEmail = student.value.guardianEmail;
    studentExtra.value.emergencyContactPhone = student.value.emergencyContactPhone;
    studentExtra.value.relationshipToStudent = student.value.relationshipToStudent;
    studentExtra.value.photo = null;
    studentExtra.value.previewImage = student.value.photo ? getFullImagePath(student.value.photo) : null;

  })
}


const onHandleSubmit = async (id) => {
  const {photo, previewImage, ...rest} = studentExtra.value

  const dto = {
    id,
    ...userFormRef.value.user,
    ...rest
  }

  const formData = new FormData();
  formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], {type: "application/json"})
  );

  if (studentExtra.value.photo instanceof File) {
    formData.append("photo", studentExtra.value.photo);
  }

  await withLoading(async () => {
    try {
      await StudentService.modifyStudent(id, formData)
      showSuccess("Student with Id: " + id + " updated successfully.")
      await router.push({name: "students"})
    } catch (err) {
      showError(err.response?.data?.message || "Error creating student!")
      console.error(err)
    }
  })

}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    studentExtra.value.photo = file;
    studentExtra.value.previewImage = URL.createObjectURL(file);
  }
}


onMounted(async () => {
  await loadStudentById(studentId)
})

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
  <h3 class="mb-3">Update Student with ID: {{ studentId }}</h3>

  <form @submit.prevent="onHandleSubmit(studentId)" class="row g-4 p-3">

    <user-update-form ref="userFormRef">
      <template #image>
        <div class="col-md-4 d-flex flex-column align-items-center text-center border-end">
          <p class="fw-semibold mb-2 mt-2">User Photo</p>

          <div class="mb-3">
            <img
                v-if="studentExtra.previewImage"
                :src="studentExtra.previewImage"
                class="rounded-circle border"
                width="150"
                height="150"
                alt="Preview"
            />

            <div v-else class="rounded-circle border bg-light d-flex align-items-center justify-content-center"
                 style="width:150px; height:150px;">
              <span class="text-muted">Preview</span>
            </div>
          </div>

          <input
              type="file"
              class="form-control"
              accept="image/*"
              @change="onFileChange"
          />
        </div>
      </template>

      <template #other-inputs>


        <app-input id="classNumber" label="Class Number" v-model="studentExtra.classNumber"/>

        <div class="col-md-4 d-flex align-items-center">
          <label class="me-2">Active</label>
          <input type="checkbox" v-model="studentExtra.active"/>
        </div>
        <app-input
            id="academicYear"
            label="Academic Year"
            v-model="studentExtra.academicYear"
        />


        <hr>
        <h3 class="mb-2">Guardian</h3>
        <app-input id="guardianName" label="Guardian Name" v-model="studentExtra.guardianName"/>
        <app-input id="guardianPhoneNumber" label="Guardian Phone Number" v-model="studentExtra.guardianPhoneNumber"
        />

        <app-input id="guardianEmail" label="Guardian Email" v-model="studentExtra.guardianEmail"
        />

        <app-input id="emergencyContactPhone" label="Emergency Contact Phone"
                   v-model="studentExtra.emergencyContactPhone"/>

        <app-select id="relationshipToStudent" :options="guardianEnum" label="Relationship To Student"
                    v-model="studentExtra.relationshipToStudent"/>


        <div class="col-12 mt-3">
          <button type="submit" class="btn btn-primary">Update Student</button>
        </div>
      </template>

    </user-update-form>
  </form>
</template>

<style scoped>

</style>