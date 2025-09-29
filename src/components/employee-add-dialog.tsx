"use client";

import { EmployeeFormData } from "@/types/employee";
import EmployeeForm from "./employee-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface EmployeeAddDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EmployeeFormData) => Promise<void>;
    loading?: boolean;
}

export default function EmployeeAddDialog({
    open,
    onClose,
    onSubmit,
    loading = false,
}: EmployeeAddDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader className="space-y-2 sm:space-y-3">
                    <DialogTitle className="text-lg sm:text-xl">
                        Add New Employee
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Fill in the details below to add a new employee to the
                        system.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <EmployeeForm
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        loading={loading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
