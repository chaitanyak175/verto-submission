import EmployeeManagement from "@/components/employee-management";

export default function EmployeesPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Employee Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your organization's employees, their departments, and
                    salaries
                </p>
            </div>
            <EmployeeManagement />
        </div>
    );
}
