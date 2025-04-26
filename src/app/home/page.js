"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "~/lib/redux/features/authSlice";
import styles from "./page.module.scss";

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login page
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-container__spinner"]}></div>
      </div>
    );
  }

  return (
    <div className={styles["home"]}>
      <div className={styles["home__header"]}>
        <div className={styles["home__header__logo"]}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="white" />
            <path
              d="M22 11L10 21"
              stroke="#6C2BE7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M10 11L22 21"
              stroke="#6C2BE7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles["home__header__logo__text"]}>Ques.AI</span>
        </div>
        <div className={styles["home__header__actions"]}>
          <div className={styles["home__header__actions__user"]}>
            {user?.name || "User"}
          </div>
          <div className={styles["home__header__actions__settings"]}>⚙️</div>
          <div className={styles["home__header__actions__notifications"]}>
            🔔
          </div>
        </div>
      </div>

      <div className={styles["home__content"]}>
        <div className={styles["home__content__title"]}>
          <h1>Create a New Project</h1>
        </div>

        <div className={styles["home__content__image"]}>
          {/* Placeholder for the image from the provided mockup */}
          <div className={styles["home__content__image__placeholder"]}></div>
        </div>

        <div className={styles["home__content__description"]}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in
          </p>
        </div>

        <div className={styles["home__content__actions"]}>
          <button className={styles["home__content__actions__button"]}>
            <span>+</span> Create New Project
          </button>
        </div>
      </div>
    </div>
  );
}
