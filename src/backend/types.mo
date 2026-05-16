import Map "mo:core/Map";

module {
  public type HospitalStatus = { #Active; #Inactive };

  public type Hospital = {
    id : Text;
    name : Text;
    logoUri : Text;
    address : Text;
    contact : Text;
    status : HospitalStatus;
    createdAt : Int;
  };

  public type SuperAdmin = {
    username : Text;
    passwordHash : Text;
  };

  public type HospitalAdminStatus = { #Active; #Inactive; #Suspended };

  public type HospitalAdmin = {
    id : Text;
    hospitalId : Text;
    username : Text;
    name : Text;
    email : Text;
    status : HospitalAdminStatus;
  };

  public type HospitalsMap = Map.Map<Text, Hospital>;
  public type HospitalAdminsMap = Map.Map<Text, HospitalAdmin>;
};
