"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, TrendingUp, DollarSign } from "lucide-react";

interface EmployeeStats {
    totalEmployees: number;
    totalDepartments: number;
    averageSalary: number;
    departmentBreakdown: {
        department: string;
        count: number;
        avgSalary: number;
    }[];
}

export default function OverviewPage() {
    const [stats, setStats] = useState<EmployeeStats>({
        totalEmployees: 0,
        totalDepartments: 0,
        averageSalary: 0,
        departmentBreakdown: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/employees");
                const employees = await response.json();

                if (Array.isArray(employees)) {
                    const totalEmployees = employees.length;
                    const departments = [
                        ...new Set(employees.map((emp: any) => emp.department)),
                    ];
                    const totalDepartments = departments.length;
                    const averageSalary =
                        employees.reduce(
                            (sum: number, emp: any) => sum + emp.salary,
                            0
                        ) / totalEmployees || 0;

                    const departmentBreakdown = departments.map((dept) => {
                        const deptEmployees = employees.filter(
                            (emp: any) => emp.department === dept
                        );
                        const avgSalary =
                            deptEmployees.reduce(
                                (sum: number, emp: any) => sum + emp.salary,
                                0
                            ) / deptEmployees.length;
                        return {
                            department: dept,
                            count: deptEmployees.length,
                            avgSalary,
                        };
                    });

                    setStats({
                        totalEmployees,
                        totalDepartments,
                        averageSalary,
                        departmentBreakdown,
                    });
                }
            } catch (error) {
                console.error("Error fetching employee stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDepartmentName = (department: string) => {
        return department.charAt(0).toUpperCase() + department.slice(1);
    };

    if (loading) {
        return (
            <div>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-32 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Employee management system analytics and statistics
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Employees
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalEmployees}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active employees in the system
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Departments
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalDepartments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active departments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Salary
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.averageSalary)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all employees
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Growth
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">
                            Employee growth this year
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Department Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.departmentBreakdown.map((dept) => (
                            <div
                                key={dept.department}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium">
                                            {formatDepartmentName(
                                                dept.department
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {dept.count} employee
                                            {dept.count !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        {formatCurrency(dept.avgSalary)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Avg. salary
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
