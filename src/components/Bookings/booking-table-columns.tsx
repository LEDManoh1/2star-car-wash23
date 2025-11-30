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
import { toast } from "sonner";
import { userInfo } from "@/data/access.signal";
import { BookingModel } from "@/model/booking.model";
import { services } from "@/pages/Services";
import { DataWrite } from "@/data/write";

import { priceSettingId } from "@/data/bookings.signal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const bookingsColumns: ColumnDef<BookingModel>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="BID" />;
    },
    cell: ({ row }) => {
      const id = row.original.id;
      return <div className="flex justify-start w-full">#{id}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },

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
    accessorKey: "service",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Services" />
    ),
    cell: ({ row }) => {
      const service = row.original.service;
      const selectedServices = service
        .split(",")
        .map((id) => {
          return services.find((fs) => fs.id === id)?.title;
        })
        .join(",");
      return (
        <div className="flex justify-start w-full">{selectedServices}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return <div className="flex justify-start w-full">{status}</div>;
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div>
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
                  toast.loading("Processing...");
                  DataWrite.update("bookings", order.id, {
                    status: "confirmed",
                  })
                    .then(() => {
                      toast.dismiss();
                      toast.success("Confirmed.");
                    })
                    .catch((e) => {
                      toast.dismiss();
                      toast.success("Something went wrong.", e);
                    });
                }}
              >
                Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.loading("Processing...");
                  DataWrite.update("bookings", order.id, {
                    status: "in-progress",
                  })
                    .then(() => {
                      toast.dismiss();
                      toast.success("On Progress.");
                    })
                    .catch((e) => {
                      toast.dismiss();
                      toast.success("Something went wrong.", e);
                    });
                }}
              >
                Mark as OnProgress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.loading("Processing...");
                  DataWrite.update("bookings", order.id, {
                    status: "on-way",
                  })
                    .then(() => {
                      toast.dismiss();
                      toast.success("Started.");
                    })
                    .catch((e) => {
                      toast.dismiss();
                      toast.success("Something went wrong.", e);
                    });
                }}
              >
                Mark as Started
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.loading("Processing...");
                  DataWrite.update("bookings", order.id, {
                    status: "complete",
                  })
                    .then(() => {
                      toast.dismiss();
                      toast.success("Completed.");
                    })
                    .catch((e) => {
                      toast.dismiss();
                      toast.success("Something went wrong.", e);
                    });
                }}
              >
                Mark as Complete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  priceSettingId.value = order.id;
                }}
              >
                Set Price
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  toast.loading("Deleting...");
                  DataWrite.delete("bookings", order.id)
                    .then(() => {
                      toast.dismiss();
                      toast.success("Deleted successfully");
                    })
                    .catch(() => {
                      toast.error("Failed to delete, Try Again.");
                    });
                }}
                disabled={userInfo.value?.admin !== true}
                className="bg-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
