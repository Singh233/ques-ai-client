"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../../lib/redux/features/authSlice";
import styles from "./Auth.module.scss";
import { env } from "~/env.mjs";
import { InfoIcon, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { setCookie } from "~/lib/hooks/useCookies";

const API_URL = env.NEXT_PUBLIC_API_URL;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const rememberMeRef = useRef(null);

  const dispatch = useDispatch();

  // Sign-in mutation
  const signInMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${API_URL}/user/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // include cookies
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Login failed");
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      if (data.tokens?.access?.token) {
        setCookie("accessToken", data.tokens.access.token);
      }
      if (data.tokens?.refresh?.token) {
        setCookie("refreshToken", data.tokens.refresh.token);
      }

      dispatch(loginSuccess(data.user));
    },
    onError: (error) => {
      setErrorMessage(error.message);
      dispatch(loginFailure(error.message));
    },
  });

  // Sign-up mutation
  const signUpMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await fetch(`${API_URL}/user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Registration failed");
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsLogin(true);
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    if (!isLogin) {
      const confirmPassword = confirmPasswordRef.current.value;
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        toast.error("Passwords do not match");
        return;
      }
    }

    const userData = {
      email: email.trim(),
      password,
    };

    if (!isLogin) {
      userData.name = fullNameRef.current?.value || "";
    }

    if (isLogin) {
      signInMutation.mutate(userData);
    } else {
      signUpMutation.mutate(userData);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  return (
    <div className={styles["auth"]}>
      <h1 className={styles["auth__welcome-heading"]}>Welcome to</h1>
      <h2 className={styles["auth__welcome-heading__subheading"]}>Ques.AI</h2>

      <form className={styles["auth__form"]} onSubmit={handleSubmit}>
        {!isLogin && (
          <div className={styles["auth__form__group"]}>
            <div className={styles["auth__form__group__input-container"]}>
              <User className={styles["auth__form__group__input-container__icon"]} size={18} />
              <input
                type="text"
                className={styles["auth__form__group__input-container__input"]}
                placeholder="Full Name"
                ref={fullNameRef}
                required
              />
            </div>
          </div>
        )}
        <div className={styles["auth__form__group"]}>
          <div className={styles["auth__form__group__input-container"]}>
            <Mail className={styles["auth__form__group__input-container__icon"]} size={18} />
            <input
              type="email"
              className={styles["auth__form__group__input-container__input"]}
              placeholder="Email Address"
              ref={emailRef}
              required
            />
          </div>
        </div>

        <div className={styles["auth__form__group"]}>
          <div className={styles["auth__form__group__input-container"]}>
            <Lock className={styles["auth__form__group__input-container__icon"]} size={18} />
            <input
              type="password"
              className={styles["auth__form__group__input-container__input"]}
              placeholder="Password"
              ref={passwordRef}
              required
            />
          </div>
        </div>

        {!isLogin && (
          <div className={styles["auth__form__group"]}>
            <div className={styles["auth__form__group__input-container"]}>
              <Lock className={styles["auth__form__group__input-container__icon"]} size={18} />
              <input
                type="password"
                className={styles["auth__form__group__input-container__input"]}
                placeholder="Confirm Password"
                ref={confirmPasswordRef}
                required
              />
            </div>
          </div>
        )}

        {isLogin && (
          <div className={styles["auth__form__checkbox-container"]}>
            <div className={styles["auth__form__checkbox-container__remember-me"]}>
              <input type="checkbox" id="rememberMe" ref={rememberMeRef} />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className={styles["auth__form__checkbox-container__forgot-password"]}>
              Forgot password?
            </a>
          </div>
        )}

        <button
          type="submit"
          className={styles["auth__form__submit-button"]}
          disabled={signInMutation.isPending || signUpMutation.isPending}
        >
          {signInMutation.isPending
            ? "Signing in..."
            : signUpMutation.isPending
            ? "Creating account..."
            : isLogin
            ? "Login"
            : "Create Account"}
        </button>
      </form>

      <div className={styles["auth__divider"]}>or</div>

      <button className={styles["auth__google-button"]}>
        <svg
          className={styles["auth__google-button__icon"]}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        Continue with Google
      </button>

      <div className={styles["auth__account-prompt"]}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span className={styles["auth__account-prompt__action-link"]} onClick={toggleAuthMode}>
          {isLogin ? " Create Account" : " Login"}
        </span>
      </div>
    </div>
  );
};

export default Auth;
