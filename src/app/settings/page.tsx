"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Settings as SettingsIcon, Palette, Bell, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState({
        companyName: "Employee Management System",
        emailNotifications: true,
        language: "en",
    });

    const handleSettingChange = (key: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    const handleSaveSettings = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                    Configure your application preferences
                </p>
            </div>

            <div className="max-w-6xl space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <SettingsIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                General
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label
                                    htmlFor="companyName"
                                    className="text-sm font-medium"
                                >
                                    Company Name
                                </Label>
                                <Input
                                    id="companyName"
                                    value={settings.companyName}
                                    onChange={(e) =>
                                        handleSettingChange(
                                            "companyName",
                                            e.target.value
                                        )
                                    }
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label
                                    htmlFor="language"
                                    className="text-sm font-medium"
                                >
                                    Language
                                </Label>
                                <Select
                                    value={settings.language}
                                    onValueChange={(value) =>
                                        handleSettingChange("language", value)
                                    }
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">
                                            English
                                        </SelectItem>
                                        <SelectItem value="es">
                                            Spanish
                                        </SelectItem>
                                        <SelectItem value="fr">
                                            French
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Palette className="h-5 w-5 text-purple-600" />
                                </div>
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label
                                    htmlFor="theme"
                                    className="text-sm font-medium"
                                >
                                    Theme Preference
                                </Label>
                                <Select
                                    value={theme}
                                    onValueChange={handleThemeChange}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-white border rounded-full"></div>
                                                Light
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                                                Dark
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Bell className="h-5 w-5 text-green-600" />
                            </div>
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="emailNotifications"
                                    className="text-base font-medium"
                                >
                                    Email Notifications
                                </Label>
                                <p className="text-sm text-gray-500">
                                    Receive email updates about employee changes
                                    and system updates
                                </p>
                            </div>
                            <Switch
                                id="emailNotifications"
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked: boolean) =>
                                    handleSettingChange(
                                        "emailNotifications",
                                        checked
                                    )
                                }
                                className="scale-110"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4 border-t">
                    <Button
                        onClick={handleSaveSettings}
                        className="px-8 py-3 text-base font-medium"
                        size="lg"
                    >
                        <Save className="h-5 w-5 mr-2" />
                        Save Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}
