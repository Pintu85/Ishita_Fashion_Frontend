import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { useAuthenticate } from "../services/login/Login.Service";
import { IResponseModel } from "../interfaces/ResponseModel";
import { useNavigate } from "react-router-dom";
import storage from "@/utils/Storage";
import { isTokenExpired, isNotNullUndefinedBlank } from "../helpers/Common";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { Loader2 } from "lucide-react";


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const token = storage.getToken();
        const IsLoggedIn = isNotNullUndefinedBlank(token) && !isTokenExpired(token);

        if (IsLoggedIn) {
            navigate("/");
        }
        else {
            navigate("/login");
        }

        if (isTokenExpired(token)) {
            window.localStorage.clear();
            navigate("/login");
            return;
        }

    }, [navigate])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        useAuthenticateMutation.mutate({
            email: formData.email,
            password: formData.password
        })
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const useAuthenticateMutation = useAuthenticate({
        onSuccess: (response: IResponseModel) => {
            if (response.statusCode === 200) {
                storage.setToken(response.data.token);
                storage.setUser(response.data.userName);
                navigate("/");
                toast({
                    title: "Logged In",
                    description: response.statusMessage,
                    variant: "default",
                });
                setLoading(false);
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error occured",
                description: error,
                variant: "destructive",
            });
            setLoading(false);
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
                            <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Ishita Fashion
                        </h1>
                        <p className="text-gray-500">Inventory Management</p>
                    </div>

                    {/* Radix UI Form */}
                    <Form.Root onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <Form.Field name="email" className="grid space-y-1">
                            <Form.Label className="text-sm font-medium text-gray-700">
                                Email Address
                            </Form.Label>
                            <Form.Control asChild>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                                    placeholder="Enter your email"
                                />
                            </Form.Control>
                            <Form.Message
                                match="valueMissing"
                                className="text-xs text-red-500 mt-1"
                            >
                                Please enter your email
                            </Form.Message>
                            <Form.Message
                                match="typeMismatch"
                                className="text-xs text-red-500 mt-1"
                            >
                                Please provide a valid email
                            </Form.Message>
                        </Form.Field>

                        {/* Password Field */}
                        <Form.Field name="password" className="grid space-y-1">
                            <Form.Label className="text-sm font-medium text-gray-700">
                                Password
                            </Form.Label>
                            <div className="relative">
                                <Form.Control asChild>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition pr-12"
                                        placeholder="Enter your password"
                                    />
                                </Form.Control>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <Form.Message
                                match="valueMissing"
                                className="text-xs text-red-500 mt-1"
                            >
                                Please enter your password
                            </Form.Message>
                        </Form.Field>

                        {/* Submit Button */}
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-600/30 mt-6"
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                        </Form.Submit>
                    </Form.Root>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    © 2024 Ishita Fashion. All rights reserved.
                </p>
            </div>
        </div >

    );
}
