"use client";

import { useState } from "react";
import { Employee } from "@/types/employee";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
    employee: Employee | null;
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteConfirmDialog({
    employee,
    open,
    onClose,
    onConfirm,
}: DeleteConfirmDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
        } catch (error) {
            console.error("Error deleting employee:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!employee) {
        return null;
    }

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="mx-auto max-w-[400px] w-[95vw]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg">
                        Delete Employee
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Are you sure you want to delete{" "}
                        <strong>{employee.name}</strong>? This action cannot be
                        undone and will permanently remove the employee from
                        your system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
                    <AlertDialogCancel
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 w-full sm:w-auto cursor-pointer"
                    >
                        {loading && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Delete Employee
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
