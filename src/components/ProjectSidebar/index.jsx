"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pen, Copy, Diamond, Settings } from "lucide-react";
import styles from "./ProjectSidebar.module.scss";
import { useAppSelector } from "~/lib/redux/store";
import { selectUser } from "~/lib/redux/features/authSlice";

const ProjectSidebar = ({ projectName }) => {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);
  console.log(user);

  const sidebarLinks = [
    {
      name: "Add Your Podcast",
      icon: <Plus size={16} />,
      path: `/home/${projectName}/add-your-podcast`,
      active: pathname.includes("add-your-podcast"),
    },
    {
      name: "Create & Repurpose",
      icon: <Pen size={16} />,
      path: `/home/${projectName}/rss-feed`,
      active: pathname.includes("rss-feed"),
    },
    {
      name: "Podcast Widget",
      icon: <Copy size={16} />,
      path: `/home/${projectName}/youtube-video`,
      active: pathname.includes("youtube-video"),
    },
    {
      name: "Upgrade",
      icon: <Diamond size={16} />,
      path: `/home/${projectName}/upload-files`,
      active: pathname.includes("upload-files"),
    },
  ];

  return (
    <aside className={styles["sidebar"]}>
      <div className={styles["sidebar__header"]}>
        <h2>Project Navigation</h2>
      </div>
      <nav className={styles["sidebar__nav"]}>
        <ul className={styles["sidebar__nav__list"]}>
          {sidebarLinks.map((link, index) => (
            <li key={index} className={styles["sidebar__nav__list__item"]}>
              <Link
                href={link.path}
                className={`${styles["sidebar__nav__list__link"]} ${
                  link.active ? styles["sidebar__nav__list__link--active"] : ""
                }`}
              >
                <span className={styles["sidebar__nav__list__link__icon"]}>
                  {link.icon}
                </span>
                <span className={styles["sidebar__nav__list__link__text"]}>
                  {link.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles["sidebar__nav__footer"]}>
          <div className={styles["sidebar__nav__footer__links"]}></div>
          <Link href="/help" className={styles["sidebar__nav__footer__link"]}>
            <span className={styles["sidebar__nav__list__link__icon"]}>
              <Settings size={16} />
            </span>
            <span className={styles["sidebar__nav__list__link__text"]}>
              Help
            </span>
          </Link>
          <div className={styles["sidebar__nav__footer__divider"]}></div>
          <Link
            href="/profile"
            className={styles["sidebar__nav__footer__link"]}
          >
            <div className={styles["sidebar__nav__footer__link__initials"]}>
              {user?.name
                ?.split(" ")
                .map((n) => n.charAt(0))
                .join("")}
            </div>
            <div className={styles["sidebar__nav__footer__link__group"]}>
              <span
                className={styles["sidebar__nav__footer__link__group__name"]}
              >
                {user?.name}
              </span>
              <span
                className={styles["sidebar__nav__footer__link__group__email"]}
              >
                {user?.email?.address}
              </span>
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default ProjectSidebar;
