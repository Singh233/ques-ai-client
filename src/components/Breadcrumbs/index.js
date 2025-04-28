"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import styles from "./Breadcrumb.module.scss";

const Breadcrumb = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs = [
      { label: "Home", path: "/home", icon: <Home size={16} /> },
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      // Skip the first 'home' segment since we already added it
      if (index === 0 && segment === "home") {
        return;
      }

      currentPath += `/${segment}`;

      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label,
        path: index === segments.length - 1 ? null : `/home${currentPath}`,
        icon: null,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className={styles["breadcrumb"]} aria-label="Breadcrumb">
      <ol className={styles["breadcrumb__list"]}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className={styles["breadcrumb__list__item"]}>
            {index > 0 && (
              <ChevronRight
                size={14}
                className={styles["breadcrumb__list__item__separator"]}
              />
            )}

            {breadcrumb.path ? (
              <Link
                href={breadcrumb.path}
                className={styles["breadcrumb__list__item__link"]}
              >
                {breadcrumb.icon && (
                  <span
                    className={styles["breadcrumb__list__item__link__icon"]}
                  >
                    {breadcrumb.icon}
                  </span>
                )}
                <span>{breadcrumb.label}</span>
              </Link>
            ) : (
              <span className={styles["breadcrumb__list__item__current"]}>
                {breadcrumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
