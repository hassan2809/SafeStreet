import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      setEmail(data.email);

      const response = await API.post("/auth/forgot-password", {
        email: data.email,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.message || "Reset link sent!");
      } else {
        setError(response.data.message || "Could not send reset link");
        toast.error(response.data.message || "Could not send reset link");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Could not send reset link";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="relative h-24 w-64 mx-auto overflow-hidden">
            <img
              src="/images/bg.png"
              alt="Company Logo"
              onClick={() => navigate("/home")}
              className="absolute inset-0 w-full h-auto cursor-pointer"
              style={{
                transform: "scale(1.5)",
                transformOrigin: "center center",
                filter: "none",
              }}
            />
          </div>
        </div>

        {/* Success Card */}
        <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Reset Link Sent
            </CardTitle>
            <CardDescription>
              Please check your email for the password reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Alert className="bg-green-50 border-green-200">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                We've sent a password reset link to <strong>{email}</strong>
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo Section */}
      <div className="mb-8">
        <div className="relative h-24 w-64 mx-auto overflow-hidden">
          <img
            src="/images/bg.png"
            alt="Company Logo"
            onClick={() => navigate("/home")}
            className="absolute inset-0 w-full h-auto cursor-pointer"
            style={{
              transform: "scale(1.5)",
              transformOrigin: "center center",
              filter: "none",
            }}
          />
        </div>
      </div>

      {/* Forgot Password Card */}
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address to get a reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="name@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
