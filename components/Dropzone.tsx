"use client";

import { db, storage } from "@/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  doc,
  serverTimestamp,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import DZ from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const Dropzone = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const MAX_FILE_SIZE = 20971520;

  // const match = name.match(
  //   new RegExp(`^${baseName}(\\(\\d+\\))?\\${ext}$`),
  // );

  const checkFileName = async (
    baseName: string,
    ext: string,
    db: any,
    userId: any,
  ) => {
    const filesRef = collection(db, "users", userId, "files");
    const prefixQuery = query(
      filesRef,
      where("fileName", ">=", baseName),
      where("fileName", "<=", baseName + "\uf8ff"),
    );
    const snapshot = await getDocs(prefixQuery);
    const fileNames = snapshot.docs.map((doc) => doc.data().fileName);

    const numbersInUse = fileNames
      .map((name) => {
        const match = name.match(
          new RegExp(`^${baseName}(\\(\\d+\\))?\\${ext}$`),
        );
        return match ? parseInt(match[1]?.slice(1, -1), 10) : null;
      })
      .filter((num) => num !== null)
      .sort((a, b) => a! - b!);

    let missingNumber = 1;
    for (let i = 0; i < numbersInUse.length; i++) {
      if (numbersInUse[i] !== i + 1) {
        missingNumber = i + 1;
        break;
      }
      if (i === numbersInUse.length - 1) {
        missingNumber = numbersInUse.length + 1;
      }
    }

    return numbersInUse.length === 0
      ? `${baseName}${ext}`
      : `${baseName}(${missingNumber})${ext}`;
  };

  const uploadFile = async (file: File) => {
    if (loading || !user) return;

    const ext = file.name.split(".").pop();
    const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");

    setLoading(true);
    const toastId = toast.loading("Uploading file...");

    try {
      const newFileName = await checkFileName(
        fileNameWithoutExt,
        `.${ext}`,
        db,
        user.id,
      );
      const fileId = `${fileNameWithoutExt}-${uuidv4()}.${ext}`;
      const storageRef = ref(storage, `users/${user.id}/files/${fileId}`);

      const snapshot = await uploadBytes(storageRef, file);
      const URL = await getDownloadURL(storageRef);
      const docRef = doc(db, "users", user.id, "files", fileId);
      const data = {
        userId: user.id,
        fileName: newFileName,
        fullName: user.fullName,
        timestamp: serverTimestamp(),
        type: file.type,
        size: file.size,
        downloadURL: URL,
      };

      await setDoc(docRef, data);
      toast.success("File uploaded successfully!", {
        id: toastId,
        duration: 1500,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file!", {
        id: toastId,
        duration: 1500,
      });
    }

    setLoading(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large!`, {
          duration: 2500,
        });
        return;
      }
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        await uploadFile(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <DZ minSize={0} onDrop={onDrop}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
        return (
          <section className="mx-4 mt-6">
            <div
              {...getRootProps()}
              className={cn(
                "flex h-60 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-600 hover:bg-background-hover  dark:border-gray-300",
                isDragActive && "animate-pulse bg-background-hover",
              )}
            >
              <input {...getInputProps()} />

              {!isDragActive && "Click here or drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop a file to upload"}
              {isDragReject && "File type not accepted, sorry!"}
            </div>
          </section>
        );
      }}
    </DZ>
  );
};

export default Dropzone;
