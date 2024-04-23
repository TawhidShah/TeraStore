"use client";

import { FileType } from "@/types";
import { Button } from "../ui/button";
import { columns } from "./columns";
import { DataTable } from "./Table";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const TableWrapper = ({ skeletonFiles }: { skeletonFiles: FileType[] }) => {
  const { user } = useUser();
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [showSkeleton, setShowSkeleton] = useState(true);

  let [docs] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files"),
        orderBy("timestamp", sort),
      ),
  );

  useEffect(() => {
    if (!docs) return;
    const files: FileType[] = docs?.docs?.map((doc) => ({
      id: doc.id,
      fileName: doc.data().fileName,
      fullName: doc.data().fullName,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000),
      downloadURL: doc.data().downloadURL,
      type: doc.data().type,
      size: doc.data().size,
    }));
    setInitialFiles(files);
  }, [docs]);

  if (!docs && showSkeleton) {
    return (
      <div className="flex flex-col">
        <Button
          variant={"outline"}
          className="mb-5 ml-auto h-10 w-36 border border-gray-600"
        >
          <Skeleton className="h-5 w-full" />
        </Button>

        <div className="rounded-lg border border-gray-600">
          <div className="">
            {skeletonFiles.map((file) => (
              <div
                key={file.id}
                className="flex w-full items-center space-x-4 p-5"
              >
                <Skeleton className="h-12 w-[6%]" />
                <Skeleton className="h-12 w-[15%]" />
                <Skeleton className="h-12 w-[49%]" />
                <Skeleton className="h-12 w-[15%]" />
                <Skeleton className="h-12 w-[15%]" />
              </div>
            ))}

            {skeletonFiles.length === 0 && (
              <div className="flex w-full items-center space-x-4 p-5">
                <Skeleton className="h-12 w-[6%]" />
                <Skeleton className="h-12 w-[15%]" />
                <Skeleton className="h-12 w-[49%]" />
                <Skeleton className="h-12 w-[15%]" />
                <Skeleton className="h-12 w-[15%]" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="ml-2 text-xl font-bold">Files</h2>
        <Button
          variant={"outline"}
          onClick={() => {
            setShowSkeleton(false);
            setSort(sort === "asc" ? "desc" : "asc");
          }}
          className="w-36"
        >
          Sort By {sort === "asc" ? "Newest" : "Oldest"}
        </Button>
      </div>
      <DataTable columns={columns} data={initialFiles}></DataTable>
    </div>
  );
};

export default TableWrapper;
