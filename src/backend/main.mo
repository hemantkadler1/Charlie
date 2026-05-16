import Types "types";
import HospitalApi "mixins/HospitalApi";
import Map "mo:core/Map";

actor {
  let hospitals : Types.HospitalsMap = Map.empty<Text, Types.Hospital>();
  let admins : Types.HospitalAdminsMap = Map.empty<Text, Types.HospitalAdmin>();

  // Super admin seeded at init — developer-only, invisible to hospital staff
  let superAdmin : Types.SuperAdmin = {
    username = "superadmin";
    passwordHash = "superadmin123";
  };

  include HospitalApi(hospitals, admins, superAdmin);
};

