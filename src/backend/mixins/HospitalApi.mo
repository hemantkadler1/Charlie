import Types "../types";
import HospitalLib "../lib/HospitalLib";

mixin (
  hospitals : Types.HospitalsMap,
  admins : Types.HospitalAdminsMap,
  superAdmin : Types.SuperAdmin,
) {
  public query func get_hospitals() : async [Types.Hospital] {
    HospitalLib.getAllHospitals(hospitals);
  };

  public query func get_hospital_by_id(id : Text) : async ?Types.Hospital {
    HospitalLib.getHospitalById(hospitals, id);
  };

  public func create_hospital(name : Text, address : Text, contact : Text) : async Types.Hospital {
    HospitalLib.createHospital(hospitals, name, address, contact);
  };

  public func update_hospital(
    id : Text,
    name : Text,
    address : Text,
    contact : Text,
    status : Types.HospitalStatus,
  ) : async ?Types.Hospital {
    HospitalLib.updateHospital(hospitals, id, name, address, contact, status);
  };

  public query func get_hospital_admins(hospitalId : Text) : async [Types.HospitalAdmin] {
    HospitalLib.getAdminsByHospital(admins, hospitalId);
  };

  public func create_hospital_admin(
    hospitalId : Text,
    username : Text,
    name : Text,
    email : Text,
  ) : async Types.HospitalAdmin {
    HospitalLib.createHospitalAdmin(admins, hospitalId, username, name, email);
  };

  public func update_hospital_admin_status(
    id : Text,
    status : Types.HospitalAdminStatus,
  ) : async ?Types.HospitalAdmin {
    HospitalLib.updateHospitalAdminStatus(admins, id, status);
  };

  public func verify_super_admin(username : Text, password : Text) : async Bool {
    HospitalLib.verifySuperAdmin(superAdmin, username, password);
  };
};
