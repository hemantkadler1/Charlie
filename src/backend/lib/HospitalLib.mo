import Types "../types";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  func genId(prefix : Text, size : Nat) : Text {
    prefix # debug_show(size) # "_" # debug_show(Time.now());
  };

  public func getAllHospitals(hospitals : Types.HospitalsMap) : [Types.Hospital] {
    hospitals.values().toArray();
  };

  public func getHospitalById(hospitals : Types.HospitalsMap, id : Text) : ?Types.Hospital {
    hospitals.get(id);
  };

  public func createHospital(
    hospitals : Types.HospitalsMap,
    name : Text,
    address : Text,
    contact : Text,
  ) : Types.Hospital {
    let id = genId("H", hospitals.size());
    let hospital : Types.Hospital = {
      id;
      name;
      logoUri = "";
      address;
      contact;
      status = #Active;
      createdAt = Time.now();
    };
    hospitals.add(id, hospital);
    hospital;
  };

  public func updateHospital(
    hospitals : Types.HospitalsMap,
    id : Text,
    name : Text,
    address : Text,
    contact : Text,
    status : Types.HospitalStatus,
  ) : ?Types.Hospital {
    switch (hospitals.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.Hospital = { existing with name; address; contact; status };
        hospitals.add(id, updated);
        ?updated;
      };
    };
  };

  public func getAdminsByHospital(admins : Types.HospitalAdminsMap, hospitalId : Text) : [Types.HospitalAdmin] {
    admins.values().filter(func(a) { a.hospitalId == hospitalId }).toArray();
  };

  public func createHospitalAdmin(
    admins : Types.HospitalAdminsMap,
    hospitalId : Text,
    username : Text,
    name : Text,
    email : Text,
  ) : Types.HospitalAdmin {
    let id = genId("A", admins.size());
    let admin : Types.HospitalAdmin = {
      id;
      hospitalId;
      username;
      name;
      email;
      status = #Active;
    };
    admins.add(id, admin);
    admin;
  };

  public func updateHospitalAdminStatus(
    admins : Types.HospitalAdminsMap,
    id : Text,
    status : Types.HospitalAdminStatus,
  ) : ?Types.HospitalAdmin {
    switch (admins.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.HospitalAdmin = { existing with status };
        admins.add(id, updated);
        ?updated;
      };
    };
  };

  public func verifySuperAdmin(superAdmin : Types.SuperAdmin, username : Text, password : Text) : Bool {
    superAdmin.username == username and superAdmin.passwordHash == password;
  };
};
