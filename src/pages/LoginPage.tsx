import { useState, useEffect } from "react";
import { authApi } from "../lib/api-client";
import { validateLoginForm } from "../lib/validation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { AuthLayout } from "../components/auth-layout";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/ui/toast";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  useEffect(() => {
    // Check if we have a message from redirect (like after signup)
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      addToast({
        id: Date.now().toString(),
        title: "Success",
        description: state.message,
        variant: "default",
      });
      // Clear the message to prevent showing it again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, addToast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const validation = validateLoginForm(username, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setLoading(true);

    try {
      await authApi.login(username, password);
      
      // Add success toast
      addToast({
        id: Date.now().toString(),
        title: "Login Success",
        description: "You've been successfully logged in!",
        variant: "default",
      });
      
      // Redirect to home page after successful login
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setErrors({ form: errorMessage });
      
      // Add error toast
      addToast({
        id: Date.now().toString(),
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // For debugging - add a console log to check if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token);
  }, []);

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.form && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
              {errors.form}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? "border-destructive" : ""}
                required
              />
              {errors.username && (
                <p className="text-destructive text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="p-0 h-auto text-xs" type="button">
                  Forgot password?
                </Button>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-destructive" : ""}
                required
              />
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

export default LoginPage;