"use client";

import { useAppDispatch, useAppSelector } from "~/lib/redux/store";
import styles from "./page.module.scss";
import Link from "next/link";
import { generatePath } from "~/lib/utils";
import { PlusCircle, User, Check, Info } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { selectUser, updateUser } from "~/lib/redux/features/authSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { env } from "~/env.mjs";
import axios from "axios";

const API_URL = env.NEXT_PUBLIC_API_URL;

export default function AccountSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  const getInitials = useCallback((name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }, []);

  const updateUserCall = useCallback(
    async (userData) => {
      try {
        const response = await axios.put(
          `${API_URL}/user/${user.id}`,
          userData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to update user"
        );
      }
    },
    [user]
  );

  const mutation = useMutation({
    mutationFn: updateUserCall,
    onSuccess: () => {
      toast.success("Name updated successfully");
      setIsEditing(false);
      dispatch(updateUser({ name }));
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const handleUpdate = () => {
    if (!name.trim() || name === user?.name || mutation.isPending) return;
    mutation.mutate({ name });
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["container__title"]}>
        <h1>Account Settings</h1>
      </div>

      <div className={styles["container__content"]}>
        <div className={styles["container__content__user-card"]}>
          <div className={styles["container__content__user-card__avatar"]}>
            <div
              className={
                styles["container__content__user-card__avatar__circle"]
              }
            >
              {getInitials(user?.name)}
            </div>
          </div>
          <div className={styles["container__content__user-card__details"]}>
            <div
              className={
                styles["container__content__user-card__details__field"]
              }
            >
              <label>User Name</label>
              {isEditing ? (
                <div
                  className={
                    styles[
                      "container__content__user-card__details__field__edit"
                    ]
                  }
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <div
                    className={
                      styles[
                        "container__content__user-card__details__field__edit__actions"
                      ]
                    }
                  >
                    <button
                      className={
                        styles[
                          "container__content__user-card__details__field__edit__actions__save"
                        ]
                      }
                      onClick={handleUpdate}
                      disabled={
                        mutation.isPending ||
                        !name.trim() ||
                        name === user?.name
                      }
                    >
                      {mutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      className={
                        styles[
                          "container__content__user-card__details__field__edit__actions__cancel"
                        ]
                      }
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || "");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    styles[
                      "container__content__user-card__details__field__display"
                    ]
                  }
                >
                  <span>{user?.name}</span>
                  <button
                    className={
                      styles[
                        "container__content__user-card__details__field__display__edit"
                      ]
                    }
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div
              className={
                styles["container__content__user-card__details__field"]
              }
            >
              <label>Email</label>
              <div
                className={
                  styles[
                    "container__content__user-card__details__field__display"
                  ]
                }
              >
                <span>{user?.email?.address}</span>
              </div>
              <div
                className={
                  styles["container__content__user-card__details__field__note"]
                }
              >
                <Info size={16} />
                Email cannot be changed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["container__banner"]}>
        <div className={styles["container__banner__message"]}>
          Oops! You don&apos;t have any active plans. <span>Upgrade now!</span>
        </div>
        <button
          className={styles["container__banner__btn"]}
          onClick={() => {
            toast.info("Upgrade feature is not available yet");
          }}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}
