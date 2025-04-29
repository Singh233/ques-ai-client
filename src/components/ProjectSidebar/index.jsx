"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pen, Copy, Diamond, Settings, Puzzle, X } from "lucide-react";
import styles from "./ProjectSidebar.module.scss";
import { useAppSelector } from "~/lib/redux/store";
import { selectUser } from "~/lib/redux/features/authSlice";
import { generatePath } from "~/lib/utils";
import Logo from "../Logo/Logo";

const ProjectSidebar = ({ projectName, isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);

  const sidebarLinks = [
    {
      name: "Dashboard",
      icon: <Puzzle size={16} />,
      path: `/home/${projectName}`,
      active: pathname === `/home/${projectName}`,
      disabled: false,
    },
    {
      name: "Add Your Podcast",
      icon: <Plus size={16} />,
      path: `/home/${projectName}/add-your-podcast`,
      active: pathname.includes("add-your-podcast"),
      disabled: false,
    },
    {
      name: "Create & Repurpose",
      icon: <Pen size={16} />,
      path: `/home/${projectName}/rss-feed`,
      disabled: true,
    },
    {
      name: "Podcast Widget",
      icon: <Copy size={16} />,
      path: `/home/${projectName}/youtube-video`,
      disabled: true,
    },
    {
      name: "Upgrade",
      icon: <Diamond size={16} />,
      path: `/home/${projectName}/upload-files`,
      disabled: true,
    },
  ];

  return (
    <aside
      className={styles[`sidebar${isCollapsed ? "--collapsed" : "--expanded"}`]}
    >
      <button className={`${styles["sidebar__toggle"]}`} onClick={onToggle}>
        <X size={16} />
      </button>
      <div className={styles["sidebar__header"]}>
        <Logo size={"md"} variant="text-purple" />
      </div>
      <nav className={styles["sidebar__nav"]}>
        <ul className={styles["sidebar__nav__list"]}>
          {sidebarLinks.map((link, index) => (
            <li key={index} className={styles["sidebar__nav__list__item"]}>
              <Link
                href={link.disabled ? "#" : link.path}
                className={`${
                  styles[
                    `sidebar__nav__list__link${
                      link.disabled
                        ? "--disabled"
                        : link.active
                        ? "--active"
                        : ""
                    }`
                  ]
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
          <Link
            href={`/home/${generatePath(projectName)}/account-settings`}
            className={
              styles[
                `sidebar__nav__footer__link${
                  pathname.includes("account-settings") ? "--active" : ""
                }`
              ]
            }
          >
            <span className={styles["sidebar__nav__list__link__icon"]}>
              <Settings size={16} />
            </span>
            <span className={styles["sidebar__nav__list__link__text"]}>
              Help
            </span>
          </Link>
          <div className={styles["sidebar__nav__footer__divider"]}></div>
          <Link
            href={`/home/${generatePath(projectName)}/account-settings`}
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
