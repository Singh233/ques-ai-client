"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "~/lib/redux/features/authSlice";

import styles from "./page.module.scss";
import Auth from "~/components/Auth/Auth";

export default function Home() {
  const dispatch = useDispatch();

  // Fetch current user on component mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className={styles["page"]}>
      <div className={styles["page__left"]}>
        <div className={styles["page__left__info-container"]}>
          <div className={styles["page__left__info-container__logo"]}>
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
            Ques.AI
          </div>
          <h1 className={styles["page__left__info-container__podcast-heading"]}>
            Your Podcast, Your Way, Powered by AI
          </h1>
          <p className={styles["page__left__info-container__tagline"]}>
            Transform your podcast production workflow with AI. Transcribe,
            edit, and publish podcasts with ease. Get started today and
            experience the future of podcasting.
          </p>
        </div>
      </div>
      <div className={styles["page__right"]}>
        <Auth />
      </div>
    </div>
  );
}
