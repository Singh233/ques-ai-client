"use client";

import { useAppSelector } from "~/lib/redux/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { env } from "~/env.mjs";
import styles from "./page.module.scss";
import Link from "next/link";
import { generatePath } from "~/lib/utils";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

const API_URL = env.NEXT_PUBLIC_API_URL;

export default function EditTranscriptPage() {
  const { loading: projectLoading, project } = useAppSelector(
    (state) => state.currentProject
  );
  const [isEditing, setIsEditing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const queryClient = useQueryClient();

  const textareaRef = useRef(null);

  // Get fileId from URL query parameters
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");

  // Fetch file data using React Query
  const fetchFile = async () => {
    if (!fileId) return null;

    try {
      const response = await axios.get(`${API_URL}/file/${fileId}`, {
        withCredentials: true,
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

  useEffect(() => {
    if (fileData) {
      setTranscript(fileData.transcript || "");
    }
  }, [fileData]);

  // Mutation for updating the transcript
  const { mutate: updateTranscript, isPending: isUpdating } = useMutation({
    mutationFn: async (newTranscript) => {
      const response = await axios.put(
        `${API_URL}/file/${fileId}`,
        { transcript: newTranscript },
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Transcript updated successfully");
      setIsEditing(false);
      // Invalidate and refetch the file data
      queryClient.invalidateQueries({ queryKey: ["file", fileId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update transcript");
    },
  });

  const handleEditToggle = () => {
    setIsEditing(true);
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 0);
    }
  };

  const handleSave = () => {
    updateTranscript(transcript);
  };

  const handleDiscard = () => {
    // Reset to the original transcript
    setTranscript(fileData?.transcript || "");
    setIsEditing(false);
  };

  const handleTranscriptChange = (e) => {
    setTranscript(e.target.value);
  };

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
          {isEditing ? (
            <>
              <button
                className={`${styles["container__title__right__button--discard"]} `}
                onClick={handleDiscard}
                disabled={isUpdating}
              >
                Discard
              </button>
              <button
                className={`${styles["container__title__right__button--save"]}`}
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : <>Save</>}
              </button>
            </>
          ) : (
            <button
              className={styles["container__title__right__button"]}
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
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
          <textarea
            ref={textareaRef}
            className={styles["container__content__transcript"]}
            value={transcript}
            onChange={handleTranscriptChange}
            disabled={!isEditing}
            placeholder="No transcript available"
          />
        </div>
      ) : (
        <div className={styles["container__empty"]}>
          <p>No file selected or file not found</p>
        </div>
      )}
    </div>
  );
}
