"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "@/components/dynamic-table-column";
import { BookingModel } from "@/model/booking.model";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const customersColumns: ColumnDef<BookingModel>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Customer" />;
    },
    cell: ({ row }) => {
      const customer = row.original.customerName;
      return <div className="flex justify-start w-full">{customer}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone;

      return <div className="flex justify-start w-full">{phone}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
    cell: ({ row }) => {
      const email = row.original.email;
      return <div className="flex justify-start w-full">{email}</div>;
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 justify-start">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                location.href = `tel:${order.phone}`;
              }}
            >
              Contact Via Phone
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                location.href = `mailto:${order.email}`;
              }}
            >
              Contact Via Email
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* <DropdownMenuItem
              onClick={() => {
                toast.loading("Deleting...");
                // useDocDelete({
                //   collection: "jobs",
                //   id: job.id,
                //   onComplete: (success) => {
                //     if (success) {
                //       toast.dismiss();
                //       toast.success("Deleted successfully");
                //     } else {
                //       toast.error("Failed to delete");
                //     }
                //   },
                // }).deleteJob();
              }}
              disabled={true}
              className="bg-red-500"
            >
              Cancel
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
