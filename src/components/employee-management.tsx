"use client";

import { useState, useEffect } from "react";
import { Employee, EmployeeFormData } from "@/types/employee";
import EmployeeTable from "./employee-table";
import EmployeeAddDialog from "./employee-add-dialog";
import EmployeeEditDialog from "./employee-edit-dialog";
import EmployeeDetailDialog from "./employee-detail-dialog";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null
    );
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
        null
    );
    const [viewingEmployeeId, setViewingEmployeeId] = useState<number | null>(
        null
    );

    const fetchEmployees = async (search?: string) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) {
                params.append("search", search);
            }

            const response = await fetch(`/api/employees?${params}`);
            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);

            toast.error("Failed to load employees", {
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeeById = async (id: number): Promise<Employee | null> => {
        try {
            const response = await fetch(`/api/employees/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Employee not found");
                }
                throw new Error("Failed to fetch employee");
            }
            const employee = await response.json();
            return employee;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch employee";
            setError(errorMessage);

            toast.error("Failed to load employee details", {
                description: errorMessage,
                duration: 4000,
            });

            return null;
        }
    };

    const handleEditEmployee = async (employee: Employee) => {
        try {
            const freshEmployee = await fetchEmployeeById(employee.id);
            if (freshEmployee) {
                setEditingEmployee(freshEmployee);
            } else {
                setEditingEmployee(employee);
            }
        } catch {
            setEditingEmployee(employee);
        }
    };

    const createEmployee = async (data: EmployeeFormData) => {
        try {
            const response = await fetch("/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create employee");
            }

            const newEmployee = await response.json();
            await fetchEmployees();
            setShowAddForm(false);

            toast.success("Employee created successfully!", {
                description: `${newEmployee.name} has been added to the system.`,
                duration: 4000,
            });
        } catch (err) {
            toast.error("Failed to create employee", {
                description:
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred",
                duration: 5000,
            });
            throw err;
        }
    };

    const updateEmployee = async (id: number, data: EmployeeFormData) => {
        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update employee");
            }

            const updatedEmployee = await response.json();
            await fetchEmployees();
            setEditingEmployee(null);

            toast.success("Employee updated successfully!", {
                description: `${updatedEmployee.name}'s information has been updated.`,
                duration: 4000,
            });
        } catch (err) {
            toast.error("Failed to update employee", {
                description:
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred",
                duration: 5000,
            });
            throw err;
        }
    };

    const deleteEmployee = async (id: number) => {
        try {
            const employeeToDelete = employees.find((emp) => emp.id === id);
            const employeeName = employeeToDelete?.name || `Employee #${id}`;

            const response = await fetch(`/api/employees/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete employee");
            }

            await fetchEmployees();
            setDeletingEmployee(null);

            toast.success("Employee deleted successfully!", {
                description: `${employeeName} has been removed from the system.`,
                duration: 4000,
            });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete employee";
            setError(errorMessage);

            toast.error("Failed to delete employee", {
                description: errorMessage,
                duration: 5000,
            });
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        fetchEmployees(term);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
                <div className="flex flex-row items-center gap-2 sm:gap-2">
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 flex-1 sm:flex-none"
                    >
                        <Plus className="h-4 w-4" />
                        Add Employee
                    </Button>
                    <ThemeToggle />
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-red-700">{error}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Employees</CardTitle>
                    <CardDescription>
                        Manage your employees. You can edit, delete, or add new
                        employees.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EmployeeTable
                        employees={employees}
                        loading={loading}
                        onEdit={handleEditEmployee}
                        onDelete={setDeletingEmployee}
                        onViewDetails={setViewingEmployeeId}
                    />
                </CardContent>
            </Card>

            <EmployeeEditDialog
                employee={editingEmployee}
                open={!!editingEmployee}
                onClose={() => setEditingEmployee(null)}
                onSubmit={async (data: EmployeeFormData) => {
                    if (editingEmployee) {
                        await updateEmployee(editingEmployee.id, data);
                    }
                }}
            />

            <EmployeeDetailDialog
                employeeId={viewingEmployeeId}
                open={!!viewingEmployeeId}
                onClose={() => setViewingEmployeeId(null)}
                onEdit={(employee) => {
                    setViewingEmployeeId(null);
                    setEditingEmployee(employee);
                }}
            />

            <EmployeeAddDialog
                open={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSubmit={createEmployee}
                loading={false}
            />

            <DeleteConfirmDialog
                employee={deletingEmployee}
                open={!!deletingEmployee}
                onClose={() => setDeletingEmployee(null)}
                onConfirm={async () => {
                    if (deletingEmployee) {
                        await deleteEmployee(deletingEmployee.id);
                    }
                }}
            />
        </div>
    );
}
