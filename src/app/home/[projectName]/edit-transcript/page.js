"use client";

import { useAppSelector } from "~/lib/redux/store";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { env } from "~/env.mjs";
import { getCookie } from "~/lib/hooks/useCookies";
import styles from "./page.module.scss";
import Link from "next/link";
import { generatePath } from "~/lib/utils";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const API_URL = env.NEXT_PUBLIC_API_URL;

export default function EditTranscriptPage() {
  const { loading: projectLoading, project } = useAppSelector(
    (state) => state.currentProject
  );

  // Get fileId from URL query parameters
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");

  // Fetch file data using React Query
  const fetchFile = async () => {
    if (!fileId) return null;

    const token = getCookie("accessToken");

    try {
      const response = await axios.get(`${API_URL}/file/${fileId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.file;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch file");
    }
  };

  // Use react-query to fetch file data
  const {
    data: fileData,
    isLoading: fileLoading,
    error: fileError,
  } = useQuery({
    queryKey: ["file", fileId],
    queryFn: fetchFile,
    enabled: !!fileId,
    onError: (error) => {
      toast.error(error.message || "Failed to fetch file");
    },
  });

  return (
    <div className={styles["container"]}>
      <div className={styles["container__title"]}>
        <div className={styles["container__title__left"]}>
          <Link
            href={`/home/${generatePath(project?.name || "")}/add-your-podcast`}
            className={styles["container__title__left__back"]}
          >
            <ArrowLeft size={30} />
          </Link>
          <h1>Edit your Transcript</h1>
        </div>
        <div className={styles["container__title__right"]}>
          <button className={styles["container__title__right__button"]}>
            Edit
          </button>
        </div>
      </div>

      {projectLoading || fileLoading ? (
        <div className={styles["container__loading"]}></div>
      ) : fileError ? (
        <div className={styles["container__error"]}>
          <p>Error loading transcript: {fileError?.message}</p>
        </div>
      ) : fileData ? (
        <div className={styles["container__content"]}>
          <p className={styles["container__content__title"]}>{fileData.name}</p>
          {/* Display file content here */}
          <div className={styles["container__content__transcript"]}>
            {fileData.transcript || "No transcript available"}
          </div>
        </div>
      ) : (
        <div className={styles["container__empty"]}>
          <p>No file selected or file not found</p>
        </div>
      )}
    </div>
  );
}
