"use client";

import { useState } from "react";
import { Employee, EmployeeFormData } from "@/types/employee";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from "./employee-form";

interface EmployeeEditDialogProps {
    employee: Employee | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EmployeeFormData) => Promise<void>;
}

export default function EmployeeEditDialog({
    employee,
    open,
    onClose,
    onSubmit,
}: EmployeeEditDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: EmployeeFormData) => {
        try {
            setLoading(true);
            await onSubmit(data);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    if (!employee) {
        return null;
    }

    const initialData: EmployeeFormData = {
        name: employee.name,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                        Edit Employee
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Update the employee information below. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <EmployeeForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    loading={loading}
                />
            </DialogContent>
        </Dialog>
    );
}
