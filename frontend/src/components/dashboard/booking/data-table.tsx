"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import ReusableDialog from "../common/reusable-dialog";
import ReusableDialog from "@/components/ui/common/dialog";
import { useToast } from "@/hooks/use-toast";
import { bookingChangeStatusService } from "@/services/booking.service";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import BookingApprovalSidesheet from "./booking-approval-sidesheet";

export function DataTable({
  data,
  isGuestUser,
  currentRole,
  currentEventStatus,
  fetchBookingDetails,
}: any) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [selectedBookingObj, setSelectedBookingObj] = useState<any>();

  const [isBookingApprovalSidesheetOpen, setIsBookingApprovalSidesheetOpen] =
    useState(false);

  const [
    isConfirmCancelBookingDialogOpen,
    setIsConfirmCancelBookingDialogOpen,
  ] = useState(false);

  const [
    isConfirmRescheduleBookingDialogOpen,
    setIsConfirmRescheduleBookingDialogOpen,
  ] = useState(false);
  const [
    isConfirmMoveToUpcomingDialogOpen,
    setIsConfirmMoveToUpcomingDialogOpen,
  ] = useState(false);
  const [
    isConfirmMoveToUnconfirmedDialogOpen,
    setIsConfirmMoveToUnconfirmedDialogOpen,
  ] = useState(false);

  const [reasonInput, setReasonInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const columnsForApprovedPast: ColumnDef<any>[] = [
    {
      accessorKey: "bookingDetails",
      header: "Booking details",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">
            {moment(row.original?.date).format("DD MMMM YYYY")}
          </p>
          <p className="text-sm">{`${moment(
            row.original?.startTime,
            "HH:mm"
          ).format("h:mma")} - ${moment(row.original?.endTime, "HH:mm").format(
            "h:mma"
          )}`}</p>
          <a
            href={row.original?.locationURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline text-sm"
          >
            Join Meeting
          </a>
        </div>
      ),
    },
    {
      accessorKey: "bookingTitle",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-40 text-sm">
          {row.original?.bookingTitle || "--"}
        </div>
      ),
    },
    {
      accessorKey: "participants",
      header: "Participants",
      cell: ({ row }) => (
        <div className="text-sm">
          You and{" "}
          {currentRole === "interviewer" ? (
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (window) {
                  window.open(
                    `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${row.original?.participantInformation?.interviewee?.username}`,
                    "_blank"
                  );
                }
              }}
            >
              {row.original?.participantInformation?.interviewee?.name}
            </span>
          ) : (
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (window) {
                  window.open(
                    `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${row.original?.participantInformation?.interviewer?.username}`,
                    "_blank"
                  );
                }
              }}
            >
              {row.original?.participantInformation?.interviewer?.name}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "techStacks",
      header: "Technology Stacks",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original?.interviewTechStacks.join(", ")}
        </div>
      ),
    },

    {
      accessorKey: "approvalStatus",
      header: "Approval Status",
      cell: ({ row }) => (
        <div className="text-sm flex flex-col gap-1">
          <div>
            {row.original?.hasApproved ? (
              <div className="">
                Mine:{" "}
                <span className="text-green-500">
                  Thanks for approving your mate.
                </span>
              </div>
            ) : (
              <div className="">
                Mine:{" "}
                <span className="text-red-500">
                  Please consider{" "}
                  <span
                    onClick={() => {
                      setIsBookingApprovalSidesheetOpen(true);
                      setSelectedBookingObj(row.original);
                    }}
                    className="cursor-pointer underline"
                  >
                    approving
                  </span>{" "}
                  your mate.{" "}
                </span>
              </div>
            )}
          </div>
          <div>
            {currentEventStatus == "past" ? (
              <div className="">
                Mate:{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={() => {
                    if (currentRole === "interviewer") {
                      if (window) {
                        window.open(
                          `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${row.original?.participantInformation?.interviewee?.username}`,
                          "_blank"
                        );
                      }
                    } else {
                      if (window) {
                        window.open(
                          `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${row.original?.participantInformation?.interviewer?.username}`,
                          "_blank"
                        );
                      }
                    }
                  }}
                >
                  Request
                </span>{" "}
                your mate for approval
              </div>
            ) : (
              <div>
                Mate: Your mate has approved and shared you testimonials! 🚀
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>{" "}
              {currentEventStatus !== "past" &&
              currentEventStatus !== "approved" ? (
                <>
                  {currentEventStatus !== "upcoming" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setIsConfirmMoveToUpcomingDialogOpen(true);
                        setSelectedBookingObj(row.original);
                      }}
                    >
                      Change status to upcoming
                    </DropdownMenuItem>
                  )}
                  {currentEventStatus !== "unconfirmed" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedBookingObj(row.original);
                        setIsConfirmMoveToUnconfirmedDialogOpen(true);
                      }}
                    >
                      Change status to unconfirmed
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedBookingObj(row.original);
                      setIsConfirmCancelBookingDialogOpen(true);
                    }}
                  >
                    Cancel this booking
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedBookingObj(row.original);
                      setIsConfirmRescheduleBookingDialogOpen(true);
                    }}
                  >
                    Reschedule this booking
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  {currentEventStatus == "past" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedBookingObj(row.original);
                          setIsConfirmCancelBookingDialogOpen(true);
                        }}
                      >
                        Cancel this booking
                      </DropdownMenuItem>{" "}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedBookingObj(row.original);
                          setIsConfirmRescheduleBookingDialogOpen(true);
                        }}
                      >
                        Reschedule this booking
                      </DropdownMenuItem>
                    </>
                  )}
                  {currentEventStatus == "approved" && (
                    <DropdownMenuItem disabled={true}>
                      View AI based insights (coming soon...)
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "bookingDetails",
      header: "Booking details",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">
            {moment(row.original?.date).format("DD MMMM YYYY")}
          </p>
          <p className="text-sm">{`${moment(
            row.original?.startTime,
            "HH:mm"
          ).format("h:mma")} - ${moment(row.original?.endTime, "HH:mm").format(
            "h:mma"
          )}`}</p>
          <a
            href={row.original?.locationURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline text-sm"
          >
            Join Meeting
          </a>
        </div>
      ),
    },
    {
      accessorKey: "bookingTitle",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-40 text-sm">{row.original?.bookingTitle}</div>
      ),
    },
    {
      accessorKey: "participants",
      header: "Participants",
      cell: ({ row }) => (
        <div className="text-sm">
          You and{" "}
          {currentRole === "interviewer" ? (
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (window) {
                  window.open(
                    `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${row.original?.participantInformation?.interviewee?.username}`,
                    "_blank"
                  );
                }
              }}
            >
              {row.original?.participantInformation?.interviewee?.name}
            </span>
          ) : (
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (window) {
                  window.open(
                    `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${row.original?.participantInformation?.interviewer?.username}`,
                    "_blank"
                  );
                }
              }}
            >
              {row.original?.participantInformation?.interviewer?.name}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "techStacks",
      header: "Technology Stacks",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original?.interviewTechStacks.join(", ")}
        </div>
      ),
    },
    {
      accessorKey: "additionalInfo",
      header: "Additional Info",
      cell: ({ row }) => (
        <div className="text-sm">{row.original?.additionalInfo}</div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>{" "}
              {currentEventStatus === "canceled" ? (
                <DropdownMenuItem disabled={true}>
                  View AI based insights (coming soon...)
                </DropdownMenuItem>
              ) : currentEventStatus !== "past" &&
                currentEventStatus !== "approved" ? (
                <>
                  {currentEventStatus !== "upcoming" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setIsConfirmMoveToUpcomingDialogOpen(true);
                        setSelectedBookingObj(row.original);
                      }}
                    >
                      Change status to upcoming
                    </DropdownMenuItem>
                  )}
                  {currentEventStatus !== "unconfirmed" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedBookingObj(row.original);
                        setIsConfirmMoveToUnconfirmedDialogOpen(true);
                      }}
                    >
                      Change status to unconfirmed
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedBookingObj(row.original);
                      setIsConfirmCancelBookingDialogOpen(true);
                    }}
                  >
                    Cancel this booking
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedBookingObj(row.original);
                      setIsConfirmRescheduleBookingDialogOpen(true);
                    }}
                  >
                    Reschedule this booking
                  </DropdownMenuItem>
                </>
              ) : (
                currentEventStatus == "past" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedBookingObj(row.original);
                        setIsConfirmCancelBookingDialogOpen(true);
                      }}
                    >
                      Cancel this booking
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedBookingObj(row.original);
                        setIsConfirmRescheduleBookingDialogOpen(true);
                      }}
                    >
                      Reschedule this booking
                    </DropdownMenuItem>
                  </>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const changeStatus = async (status: string) => {
    try {
      setIsLoading(true);
      await bookingChangeStatusService(
        status,
        currentRole,
        selectedBookingObj?.meetingId,
        reasonInput,
        selectedBookingObj?.bookingLink
      );

      fetchBookingDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error changing status, ${error?.message}`,
      });
    } finally {
      setIsLoading(false);
      setIsConfirmCancelBookingDialogOpen(false);
      setIsConfirmRescheduleBookingDialogOpen(false);
      setIsConfirmMoveToUpcomingDialogOpen(false);
      setIsConfirmMoveToUnconfirmedDialogOpen(false);
    }
  };

  const table = useReactTable({
    data,
    columns:
      currentEventStatus == "past" || currentEventStatus == "approved"
        ? columnsForApprovedPast
        : columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <ReusableDialog
        isOpen={isConfirmCancelBookingDialogOpen}
        onClose={() => {
          setIsConfirmCancelBookingDialogOpen(false);
          setReasonInput("");
        }}
        onConfirm={() => changeStatus("canceled")}
        isProcessing={isLoading}
        title="Confirm Cancel Booking"
        description={`You are about to cancel this booking. This action is irreversible. Are you sure you want to cancel it?`}
        confirmText="Yes, I want to cancel!"
        cancelText="Cancel"
        variant="destructive"
      />

      <ReusableDialog
        isOpen={isConfirmRescheduleBookingDialogOpen}
        onClose={() => {
          setIsConfirmRescheduleBookingDialogOpen(false);

          setReasonInput("");
        }}
        onConfirm={() => changeStatus("rescheduled")}
        isProcessing={isLoading}
        title="Confirm Reschedule Booking"
        description={`You are about to reschedule this booking. This action is irreversible. Are you sure you want to reschedule it?`}
        confirmText="Yes, I want to reschedule!"
        cancelText="Cancel"
        variant="destructive"
      />

      <ReusableDialog
        isOpen={isConfirmMoveToUpcomingDialogOpen}
        onClose={() => {
          setReasonInput("");
          setIsConfirmMoveToUpcomingDialogOpen(false);
        }}
        onConfirm={() => changeStatus("upcoming")}
        isProcessing={isLoading}
        title="Confirm Move to Upcoming"
        description={`You are about to move this booking to upcoming. This action is irreversible. Are you sure you want to move it to upcoming?`}
        confirmText="Yes, I want to move to upcoming!"
        cancelText="Cancel"
        variant="destructive"
      />

      <ReusableDialog
        isOpen={isConfirmMoveToUnconfirmedDialogOpen}
        onClose={() => {
          setReasonInput("");
          setIsConfirmMoveToUnconfirmedDialogOpen(false);
        }}
        onConfirm={() => changeStatus("unconfirmed")}
        isProcessing={isLoading}
        title="Confirm Move to Unconfirmed"
        description={`You are about to move this booking to unconfirmed. This action is irreversible. Are you sure you want to move it to unconfirmed?`}
        confirmText="Yes, I want to move to unconfirmed!"
        cancelText="Cancel"
        variant="destructive"
      />

      <BookingApprovalSidesheet
        show={isBookingApprovalSidesheetOpen}
        setShow={setIsBookingApprovalSidesheetOpen}
        fetchBookingDetails={fetchBookingDetails}
        selectedBookingObj={selectedBookingObj}
        setSelectedBookingObj={setSelectedBookingObj}
        currentRole={currentRole}
      />
    </>
  );
}
