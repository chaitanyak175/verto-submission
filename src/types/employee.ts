export type Department =
    | "engineering"
    | "design"
    | "product"
    | "marketing"
    | "sales"
    | "human-resources";

export const DEPARTMENTS: { value: Department; label: string }[] = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "product", label: "Product" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "human-resources", label: "Human Resources" },
];

export interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    department: Department;
    salary: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEmployeeData {
    name: string;
    email: string;
    position: string;
    department: Department;
    salary: number;
}

export interface UpdateEmployeeData {
    name: string;
    email: string;
    position: string;
    department: Department;
    salary: number;
}

export interface EmployeeFormData {
    name: string;
    email: string;
    position: string;
    department: Department;
    salary: number;
}
