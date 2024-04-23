import React from "react";
import Dropzone from "@/components/Dropzone";
import { auth } from "@clerk/nextjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import TableWrapper from "@/components/table/TableWrapper";
import { FileType } from "@/types";

const page = async () => {
  const { userId } = auth();

  const docs = await getDocs(collection(db, "users", userId!, "files"));

  const skeletonFiles: FileType[] = docs.docs.map((doc) => ({
    id: doc.id,
    fileName: doc.data().fileName,
    fullName: doc.data().fullName,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000),
    downloadURL: doc.data().downloadURL,
    type: doc.data().type,
    size: doc.data().size,
  }));

  return (
    <div className="flex-1">
      <Dropzone />
      <section className="container mt-6">
        <TableWrapper skeletonFiles={skeletonFiles} />
      </section>
    </div>
  );
};

export default page;
