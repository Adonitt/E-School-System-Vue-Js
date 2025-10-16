<script setup>
import {onMounted, ref, watch} from "vue";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import {useEnumStore} from "@/stores/enumStore.js";

const user = ref({
  personalNumber: "",
  name: "",
  surname: "",
  gender: "",
  birthDate: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  phoneNumber: "",
  role: "",
  notes: "",
  email: ""
});

const enumStore = useEnumStore();


const gender = [
  {label: 'Male', value: 'MALE'},
  {label: 'Female', value: 'FEMALE'},
];

onMounted(() => {
  enumStore.loadCountries();
});

watch(() => user.value.country, (newCountry) => {
  enumStore.loadCities(newCountry);
  user.value.city = "";
});

defineExpose({user});
</script>

<template>
  <div class="card shadow-sm p-3">
    <div class="row">

      <slot name="image"/>

      <div class="col-md-8">
        <div class="row g-3">
          <AppInput id="personalNr" placeholder="Enter Personal Number" v-model="user.personalNumber"
                    label="Personal Number" required/>
          <AppInput id="firstName" v-model="user.name" placeholder="Enter First name" label="Name" required/>
          <AppInput id="lastName" v-model="user.surname" label="Surname" placeholder="Enter Last Name" required/>

          <AppSelect id="gender" v-model="user.gender" label="Gender" :options="gender" required/>

          <AppInput v-model="user.birthDate" type="date" label="Birth Date" required id="birthdate"/>
          <AppInput id="address" v-model="user.address" label="Address" required placeholder="Enter Address"/>
          <AppSelect
              id="country"
              v-model="user.country"
              label="Country"
              :options="enumStore.countries"
              required
          />

          <AppSelect
              id="city"
              v-model="user.city"
              label="City"
              :options="enumStore.cities"
              :disabled="!user.country"
              required
          />

          <AppInput id="postalCode" v-model="user.postalCode" label="Postal Code" required
                    placeholder="Enter Postal Code"/>
          <AppInput id="phoneNumber" v-model="user.phoneNumber" label="Phone Number" required
                    placeholder="Enter Phone Number"/>

          <AppInput id="notes" v-model="user.notes" label="Notes" required placeholder="Enter Notes"/>
          <AppInput id="email" v-model="user.email" type="email" label="Email" required placeholder="Enter Email"/>

          <slot name="other-inputs"/>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}

input[type="file"] {
  margin-top: 8px;
}

@media (max-width: 768px) {
  .border-end {
    border-right: 0 !important;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 15px;
    padding-bottom: 15px;
  }
}
</style>
