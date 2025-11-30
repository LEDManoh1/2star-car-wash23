/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DataWrite } from "@/data/write";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircleIcon,
  Car,
  CheckCircle,
  CheckCircle2Icon,
  Copy,
  X,
} from "lucide-react";

import { services } from "@/pages/Services";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Timestamp } from "firebase/firestore";

export function ServiceSelector({ form }: { form: any }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <FormField
      control={form.control}
      name="service"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Services</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2">
              {/* Input + Pills inside */}
              <div className="flex flex-wrap items-center gap-2 rounded-md border px-2 py-1">
                {(field.value || []).map((serviceId: string) => {
                  const service = services.find((u) => u.id === serviceId);
                  return (
                    <span
                      key={serviceId}
                      className="px-2 py-1 bg-gray-500 rounded-full text-sm text-white flex items-center gap-1 hover:text-red-200"
                    >
                      {service?.title || serviceId}
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            field.value.filter((id: string) => id !== serviceId)
                          )
                        }
                        className="ml-1 text-white "
                        style={{
                          color: "white",
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}

                {/* Input field that opens dropdown */}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Input
                      className="border-0 focus-visible:ring-0 shadow-none p-1 flex-1"
                      placeholder="Type to search..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                      }}
                      onFocus={() => setOpen(true)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[250px]">
                    <Command>
                      <CommandGroup>
                        {services
                          .filter(
                            (u) =>
                              u.title
                                .toLowerCase()
                                .includes(query.toLowerCase()) &&
                              !(field.value || []).includes(u.id)
                          )
                          .map((service) => (
                            <CommandItem
                              key={service.id}
                              onSelect={() => {
                                field.onChange([
                                  ...(field.value || []),
                                  service.id,
                                ]);
                                setQuery("");
                                setOpen(false);
                              }}
                            >
                              {service.title}
                            </CommandItem>
                          ))}
                        {services.filter((u) =>
                          u.title.toLowerCase().includes(query.toLowerCase())
                        ).length === 0 && (
                          <CommandItem disabled>No results</CommandItem>
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function BookingConfirmation({
  open,
  bookingId,
  onClose,
}: {
  open: boolean;
  bookingId: string;
  onClose: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {/* Booking Details */}
            <div className="space-y-6 w-full">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Service Details
                  </h3>
                </div>
                <p className="text-gray-600">
                  Your car wash appointment has been successfully scheduled.
                </p>
                <p className="text-blue-800 font-semibold flex gap-3 mt-6">
                  Booking ID: {bookingId}{" "}
                  <Copy
                    className="w-5 h-5 text-blue-400"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(bookingId)
                        .then(() => {
                          toast.success("Booking ID Copied");
                        })
                        .catch((err) => {
                          toast.error("Failed to copy: ", err);
                        });
                    }}
                  />
                </p>
              </div>
            </div>
            {/* Next Steps */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    We'll call you within 30 minutes to confirm details
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Our team will arrive at your location on time</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Enjoy your sparkling clean car!</span>
                </li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const formSchema = z.object({
  customerName: z
    .string()
    .min(2, { message: "Full Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  service: z.array(z.string()),
  location: z.string(),
});

export default function Booking() {
  const [processing, setProcessing] = useState(false);
  const [tempId, setTempId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      service: [],
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setProcessing(true);
    const fData = {
      customerName: values.customerName,
      email: values.email,
      phone: values.phone,
      service: values.service.join(","),
      status: "scheduled",
      estimatedTime: "Processing...",
      currentStep: "Preparing...",
      location: values.location,
      amount: 0,
      time: Timestamp.now(),
    };

    const bookingId = `2SW-${Date.now().toString().slice(-6)}`;
    toast.loading("Processing...");
    DataWrite.set("bookings", bookingId, fData)
      .then(() => {
        setProcessing(false);
        toast.dismiss();
        toast.custom(() => (
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Success! Your request have been submitted</AlertTitle>
            <AlertDescription>We will contact you shortly.</AlertDescription>
          </Alert>
        ));

        form.reset();
        setTempId(bookingId);
        //send notifications and alert the admin.
        DataWrite.create("notifications", {
          subject: `New Order #${bookingId}`,
          content: `You've receive a new order`,
          target: "admin",
          seen: [],
          createdAt: Timestamp.now(),
          intent: "/admin",
          externalLink: false,
        });
      })
      .catch((e) => {
        setProcessing(false);
        toast.dismiss();
        toast.custom(() => (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to process your request.</AlertTitle>
            <AlertDescription>
              <p>Please verify your information and try again.</p>
              <ul className="list-inside list-disc text-sm">
                <li>Check your name details</li>
                <li>Ensure a valid phone</li>
              </ul>
              <p>{e}</p>
            </AlertDescription>
          </Alert>
        ));
      });
  }

  return (
    <div className="m-5 bg-muted/50 p-5 rounded-2xl space-y-8">
      <BookingConfirmation
        open={tempId !== ""}
        bookingId={tempId}
        onClose={() => setTempId("")}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex w-full">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem className="w-full mr-5">
                  <FormLabel>FullName</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full mr-5">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full mr-5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full">
            <ServiceSelector form={form} />
          </div>
          <div className="flex w-full">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full mr-5">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Select location"
                      {...field}
                      type="map"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
