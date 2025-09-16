<script setup>
import {ref} from "vue";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";

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
  email: "",
  password: "",
  confirmPassword: ""
});


const cities = [
  {label: 'Prishtina', value: 'PRISHTINE'},
  {label: 'Besiane', value: 'BESIANE'},
  {label: 'Fushe Kosove', value: 'FUSHEKOSOVE'},
  {label: 'Ferizaj', value: 'FERIZAJ'},
  {label: 'Mitrovice', value: 'MITROVICE'},
  {label: 'Vushtrri', value: 'VUSHTRRI'},
  {label: 'Peje', value: 'PEJE'},
  {label: 'Tirane', value: 'TIRANA'},
  {label: 'Durres', value: 'DURRES'},
  {label: 'Shkoder', value: 'SHKODER'},
  {label: 'Shkup', value: 'SKOPJE'},
  {label: 'Tetove', value: 'TETOVO'},
  {label: 'Podgorica', value: 'PODGORICA'},
];

const countries = [
  {label: 'Kosove', value: 'KOSOVO'},
  {label: 'Shqiperi', value: "ALBANIA"},
  {label: 'Maqedonia e Veriut', value: "NORTH_MACEDONIA"},
  {label: 'Mali i Zi', value: "MONTENEGRO"}
];

const gender = [
  {label: 'Male', value: 'MALE'},
  {label: 'Female', value: 'FEMALE'},
];

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
          <AppSelect id="country" v-model="user.country" label="Country" :options="countries" required/>
          <AppSelect v-model="user.city" label="City" :options="cities" required id="city"/>

          <AppInput id="postalCode" v-model="user.postalCode" label="Postal Code" required
                    placeholder="Enter Postal Code"/>
          <AppInput id="phoneNumber" v-model="user.phoneNumber" label="Phone Number" required
                    placeholder="Enter Phone Number"/>

          <AppInput id="notes" v-model="user.notes" label="Notes" required placeholder="Enter Notes"/>
          <AppInput id="email" v-model="user.email" type="email" label="Email" required placeholder="Enter Email"/>

          <AppInput id="password" v-model="user.password" type="password" label="Password" required
                    placeholder="Enter Password"/>
          <AppInput id="confirmPassword" v-model="user.confirmPassword" type="password" label="Confirm Password"
                    required placeholder="Enter Confirm Password"/>

          <slot/>
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
