"use client";

import Logo from "~/components/Logo/Logo";
import styles from "./page.module.scss";
import Auth from "~/components/Auth/Auth";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles["page"]}>
      <div className={styles["page__left"]}>
        <div className={styles["page__left__background"]}>
          <Image
            src={`/images/waves.png`}
            alt="Create Project"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles["page__left__info-container"]}>
          <div className={styles["page__left__info-container__logo"]}>
            <Logo size="lg" variant="text-white" />
          </div>
          <h1 className={styles["page__left__info-container__podcast-heading"]}>
            Your podcast, <br></br>
            will no longer <br></br>
            be just a hobby.
          </h1>
          <p className={styles["page__left__info-container__tagline"]}>
            Supercharge Your Distribution <br></br> using our AI assistant!
          </p>
        </div>
      </div>
      <div className={styles["page__right"]}>
        <Auth />
      </div>
    </div>
  );
}
