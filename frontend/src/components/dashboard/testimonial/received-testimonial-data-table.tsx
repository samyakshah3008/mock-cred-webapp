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

import ReusableDialog from "@/components/ui/common/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { editVisibilityService } from "@/services/testimonials.service";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import ViewReceivedTestimonialSidesheet from "./view-received-testimonial-sidesheet";

const ReceivedTestimonialDataTable = ({
  data,
  currentRole,
  fetchTestimonials,
}: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [selectedTestimonialObj, setSelectedTestimonialObj] = useState<any>();

  const [isViewSidesheetOpen, setIsViewSidesheetOpen] = useState(false);

  const [isMakeToPublicDialogOpen, setIsMakeToPublicDialogOpen] =
    useState(false);

  const [isMakeToPrivateDialogOpen, setIsMakeToPrivateDialogOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{row.original?.date}</p>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="max-w-40 text-sm">{row.original?.rating}/5</div>
      ),
    },
    {
      accessorKey: "testimonialText",
      header: "Testimonial",
      cell: ({ row }) => (
        <div className="text-sm">{row.original?.testimonialText}</div>
      ),
    },
    {
      accessorKey: "testimonialGiver",
      header: "Given by",
      cell: ({ row }) => (
        <div className="text-sm cursor-pointer underline">
          <a href={row.original?.testimonialGiverPublicProfile} target="_blank">
            {row.original?.testimonialGiverName}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "showOnProfile",
      header: "Visibility",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original?.showOnProfile ? "Public ✅" : "Private 🤫"}
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTestimonialObj(row.original);
                  setIsViewSidesheetOpen(true);
                }}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTestimonialObj(row.original);
                  if (row.original?.showOnProfile) {
                    setIsMakeToPrivateDialogOpen(true);
                  } else {
                    setIsMakeToPublicDialogOpen(true);
                  }
                }}
              >
                {row.original?.showOnProfile
                  ? "Make visibility private"
                  : "Make visibility public"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
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

  const onMakeToPublic = async () => {
    try {
      setIsLoading(true);
      await editVisibilityService(
        selectedTestimonialObj?._id,
        currentRole,
        true
      );
      toast({
        title: "Testimonial visibility made to public successfully! ✅🚀",
      });

      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Failed to make testimonial public! Please try again later,. ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsMakeToPublicDialogOpen(false);
      setIsMakeToPrivateDialogOpen(false);
    }
  };

  const onMakeToPrivate = async () => {
    try {
      setIsLoading(true);
      await editVisibilityService(
        selectedTestimonialObj?._id,
        currentRole,
        false
      );
      toast({
        title: "Testimonial visibility made to private successfully! ✅🤫",
      });
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Failed to make testimonial private! Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsMakeToPublicDialogOpen(false);
      setIsMakeToPrivateDialogOpen(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="text-orange-500 font-bold text-center underline mb-5">
          Take a look at testimonials people gave you:{" "}
        </div>
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

        <ViewReceivedTestimonialSidesheet
          show={isViewSidesheetOpen}
          setShow={setIsViewSidesheetOpen}
          selectedTestimonialObj={selectedTestimonialObj}
          setSelectedTestimonialObj={setSelectedTestimonialObj}
        />

        <ReusableDialog
          isOpen={isMakeToPublicDialogOpen}
          title="Make testimonial public"
          onConfirm={onMakeToPublic}
          isProcessing={isLoading}
          description={`You are about to make this testimonial public. This means anyone can see this testimonial on your public profile page. Are you sure you want to proceed?`}
          confirmText="Yes, I want to make this public!"
          cancelText="Cancel"
          onClose={() => setIsMakeToPublicDialogOpen(false)}
        />

        <ReusableDialog
          isOpen={isMakeToPrivateDialogOpen}
          title="Make testimonial private"
          onConfirm={onMakeToPrivate}
          isProcessing={isLoading}
          description={`You are about to make this testimonial private. This means no one can see this testimonial on your public profile page. Are you sure you want to proceed?`}
          confirmText="Yes, I want to make this private!"
          cancelText="Cancel"
          onClose={() => setIsMakeToPrivateDialogOpen(false)}
        />
      </div>
    </>
  );
};

export default ReceivedTestimonialDataTable;
