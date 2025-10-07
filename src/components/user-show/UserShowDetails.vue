<script setup>

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: "Profile Details"
  }
});
const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

</script>

<template>

  <section class="section profile">
    <div class="row">
      <div class="d-flex justify-content-center gap-2 m-3 ">
        <slot name="buttons"/>
      </div>

      <div class="col-xl-4">
        <div class="card">
          <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
            <img
                :src="getFullImagePath(user?.photo)"
                alt="Profile"
                class="rounded-circle"
                height="150"
                width="150"
            />
            <h2>{{ user?.name + " " + user?.surname }}</h2>
            <h3>{{ user?.role }}</h3>
          </div>
        </div>
        <div class="card">
          <div class="card-body profile-card pt-4 d-flex flex-column ">

            <div class="row">
              <div class="col-lg-5 col-md-4 label">Created By:</div>
              <div class="col-lg-7 col-md-8">{{ user?.createdBy }}</div>

            </div>
            <br>
            <div class="row">
              <div class="col-lg-5 col-md-4 label">Created At:</div>
              <div class="col-lg-7 col-md-8">{{ user?.createdDate }}</div>
            </div>
            <br>
<!--            <div class="row">-->
<!--              <div class="col-lg-5 col-md-4 label">Modified By</div>-->
<!--              <div class="col-lg-7 col-md-8">{{ user?.modifiedBy }}</div>-->
<!--            </div>-->
<!--            <br>-->
<!--            <div class="row">-->
<!--              <div class="col-lg-5 col-md-4 label">Modified At</div>-->
<!--              <div class="col-lg-7 col-md-8">{{ user?.modifiedDate }}</div>-->
<!--            </div>-->
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
                  <div class="col-lg-9 col-md-8">{{ user?.personalNumber }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Full Name</div>
                  <div class="col-lg-9 col-md-8">{{ user?.name }} {{ user?.surname }}</div>
                </div>


                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Gender</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.gender }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Birthdate</div>
                  <div class="col-lg-9 col-md-8">{{ user?.birthDate }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Address</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.address }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">City</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.city }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Country</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.country }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Postal Code</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.postalCode }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Phone Number</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.phoneNumber }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Role</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.role }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Notes</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.notes }}</div>
                </div>

                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Email</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.email }}</div>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-4 label">Notes</div>
                  <div class="col-lg-9 col-md-8"> {{ user?.notes }}</div>
                </div>

              <hr>

                <slot name="other-details"/>
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