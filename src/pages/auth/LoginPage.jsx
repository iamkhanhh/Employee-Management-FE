import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username, "Password:", password);
  };

  const handleContinue = () => {
    setResetOpen(false);
    navigate("/change-password", { state: { email: resetEmail } });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-gray-50 to-white">
        <div className="mx-auto max-w-6xl w-full px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left panel */}
            <div className="hidden md:block">
              <div className="mb-10 text-center">
                <img
                  src="https://phanmemnhansu.com/wp-content/uploads/2021/06/thumnail-mo-hinh-quan-ly-nhan-su.png"
                  alt="Team Illustration"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
                <div className="mt-6 text-gray-900">
                  <h3 className="text-2xl font-semibold mb-2">Welcome back!</h3>
                  <p className="text-gray-600 text-sm">A professional employee management system</p>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="w-full">
              <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="p-6 md:p-8">
                  <h2 className="text-3xl font-semibold text-gray-900">Sign in</h2>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* Email */}
                    <div>
                      <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="username"
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <button
                          type="button"
                          className="text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => setResetOpen(true)}
                        >
                          Forgot your password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                          placeholder="••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242"
                              />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember me */}
                    <div className="pt-1">
                      <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label={<span className="text-sm text-gray-700">Remember me</span>}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className="h-12 rounded-lg bg-linear-to-b from-gray-800 to-gray-900 normal-case text-white shadow-sm hover:from-gray-900 hover:to-black"
                    >
                      Sign in
                    </Button>

                    <p className="mt-2 text-center text-sm text-gray-600">
                      Don't have an account?{" "}
                      <a href="#" className="font-medium text-gray-900 hover:underline">
                        Sign up
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset password dialog */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent>
          <p className="text-gray-600 text-sm mb-4">
            Enter your account's email address, and we'll send you a link to reset your password.
          </p>
          <TextField
            autoFocus
            margin="dense"
            id="reset-email"
            label="Email address"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={() => setResetOpen(false)} variant="text">
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            variant="contained"
            className="bg-linear-to-b from-gray-800 to-gray-900 normal-case text-white hover:from-gray-900 hover:to-black"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
