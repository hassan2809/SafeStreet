import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
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
  Shield,
  Loader2,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [error, setError] = useState("");
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        const response = await API.post("/auth/verify-reset-token", {
          token,
        });

        if (!response.data.success) {
          setIsValidToken(false);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await API.post("/auth/reset-password", {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.message || "Password reset successfully!");
      } else {
        setError(response.data.message || "Failed to reset password.");
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
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

        {/* Invalid Token Card */}
        <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              Your reset link is invalid or has expired
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Your reset link is invalid or has expired. Please request a new
                one.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Link to="/forgot-password" className="w-full">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
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
              Password Reset Successfully!
            </CardTitle>
            <CardDescription>
              Your password has been updated. You can now log in with your new
              password.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-center">
            <Button className="w-full" onClick={() => navigate("/login")}>
              Continue to Login
            </Button>
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

      {/* Reset Password Card */}
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
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
            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <PasswordInput
                id="password"
                {...register("password", {
                  required: "New password is required",
                })}
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="Confirm your new password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Reset Password
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

export default ResetPassword;
