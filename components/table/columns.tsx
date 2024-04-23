"use client";

import { FileType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
import { FileIcon, defaultStyles } from "react-file-icon";
import { fileTypeColors, fileTextColors } from "@/constants/fileTypeColors";
import { Pen } from "lucide-react";
import { useAppStore } from "@/store/store";

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue, ...props }) => {
      const type = renderValue() as string;
      const ext = type.split("/")[1];
      return (
        <div className="w-10">
          <FileIcon
            extension={ext}
            labelColor={fileTypeColors[ext]}
            labelTextColor={fileTextColors[ext]}
            // {...defaultStyles[ext]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "fileName",
    header: "Filename",
    cell: ({ renderValue, ...props }) => {
      const { setFileId, setFileName, setIsRenameModalOpen } = useAppStore();
      const openRenameModal = (id: string, name: string) => {
        setFileId(id);
        setFileName(name);
        setIsRenameModalOpen(true);
      };

      return (
        <div
          className="flex w-fit cursor-pointer items-center space-x-2 border-white hover:border-b"
          onClick={() => {
            openRenameModal(props.row.original.id, props.row.original.fileName);
          }}
        >
          <span>{renderValue() as string}</span>
          <Pen width={15} />
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
    cell: ({ renderValue, ...props }) => {
      return (
        <div className="flex flex-col">
          <div> {new Date(renderValue() as string).toLocaleDateString()}</div>
          <div className="text-xs text-gray-600 dark:text-gray-500">
            {new Date(renderValue() as string).toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue, ...props }) => {
      return <span>{prettyBytes(renderValue() as number)}</span>;
    },
  },
  {
    accessorKey: "downloadURL",
    header: "Link",
    cell: ({ renderValue, ...props }) => {
      return (
        <Link
          href={(renderValue() as string) || ""}
          target="_blank"
          prefetch={false}
          className="text-blue-500 underline hover:text-blue-600"
        >
          Download
        </Link>
      );
    },
  },
];
