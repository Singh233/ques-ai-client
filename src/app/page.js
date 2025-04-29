"use client";

import Logo from "~/components/Logo/Logo";
import styles from "./page.module.scss";
import Auth from "~/components/Auth/Auth";

export default function Home() {
  return (
    <div className={styles["page"]}>
      <div className={styles["page__left"]}>
        <div className={styles["page__left__info-container"]}>
          <div className={styles["page__left__info-container__logo"]}>
            <Logo size="lg" variant="text-white" />
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
