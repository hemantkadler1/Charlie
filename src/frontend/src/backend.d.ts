import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Hospital {
    id: string;
    status: HospitalStatus;
    contact: string;
    name: string;
    createdAt: bigint;
    logoUri: string;
    address: string;
}
export interface HospitalAdmin {
    id: string;
    status: HospitalAdminStatus;
    username: string;
    name: string;
    email: string;
    hospitalId: string;
}
export enum HospitalAdminStatus {
    Inactive = "Inactive",
    Active = "Active",
    Suspended = "Suspended"
}
export enum HospitalStatus {
    Inactive = "Inactive",
    Active = "Active"
}
export interface backendInterface {
    create_hospital(name: string, address: string, contact: string): Promise<Hospital>;
    create_hospital_admin(hospitalId: string, username: string, name: string, email: string): Promise<HospitalAdmin>;
    get_hospital_admins(hospitalId: string): Promise<Array<HospitalAdmin>>;
    get_hospital_by_id(id: string): Promise<Hospital | null>;
    get_hospitals(): Promise<Array<Hospital>>;
    update_hospital(id: string, name: string, address: string, contact: string, status: HospitalStatus): Promise<Hospital | null>;
    update_hospital_admin_status(id: string, status: HospitalAdminStatus): Promise<HospitalAdmin | null>;
    verify_super_admin(username: string, password: string): Promise<boolean>;
}
