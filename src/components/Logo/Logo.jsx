import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.scss";

const Logo = ({ size, height, width, variant = "stripped-purple" }) => {
  return (
    <Link href="/" className={styles[`logo`]}>
      <Image
        src={`/logos/ques-ai-logo-${variant}.svg`}
        alt="Ques AI Logo"
        width={width || (size === "sm" ? 120 : size === "md" ? 150 : 200)}
        height={height || (size === "sm" ? 35 : size === "md" ? 45 : 75)}
        className={styles["logo__image"]}
        priority
      />
    </Link>
  );
};

export default Logo;
