import { useState } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  CreditCard,
  Settings,
  Bell,
  Car,
  DollarSign,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react";
import PaymentManagement from "../components/PaymentManagement";
import { logout, user, userInfo } from "@/data/access.signal";
import { useSignals } from "@preact/signals-react/runtime";
import { bookings, priceSettingId } from "@/data/bookings.signal";
import { DataTable } from "@/components/ui/data-table";
import { bookingsColumns } from "@/components/Bookings/booking-table-columns";
import { customersColumns } from "@/components/Customers/customers-table-columns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  markNotificationAsSeen,
  notifications,
} from "@/data/notifications.signal";
import { auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { services } from "./Services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { DataWrite } from "@/data/write";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  amount: z.string(),
});

function PriceSetting({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Processing...");
    const fData = {
      amount: Number.parseFloat(values.amount),
    };

    DataWrite.set("bookings", priceSettingId.value, fData)
      .then(() => {
        toast.dismiss();
        toast.custom(() => (
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>
              Success! Your have updated the booking price
            </AlertTitle>
            <AlertDescription>
              Notify the customer to proceed with the booking.
            </AlertDescription>
          </Alert>
        ));

        form.reset();
        onClose();
      })
      .catch((e) => {
        toast.dismiss();
        toast.custom(() => (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to process your request.</AlertTitle>
            <AlertDescription>
              <p>Please verify your information and try again.</p>
              <ul className="list-inside list-disc text-sm">
                <li>Check your details</li>
              </ul>
              <p>{e}</p>
            </AlertDescription>
          </Alert>
        ));
      });
  }
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Set Price for #{priceSettingId.value}
            </h2>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex w-full">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="w-full mr-5">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter New Amount"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-5 justify-end">
                  <Button type="submit" onClick={() => {}}>
                    Update
                  </Button>
                  <AlertDialogAction
                    onClick={() => {
                      onClose();
                    }}
                    className="bg-red-500"
                  >
                    Close
                  </AlertDialogAction>
                </div>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const Admin = () => {
  useSignals();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "customers",
      label: "Customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: "TZSH 2,450,000",
      change: "+12.5%",
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      color: "green",
    },
    {
      title: "Total Bookings",
      value: bookings.value.length,
      change: "+1.2%",
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      color: "blue",
    },
    {
      title: "Active Customers",
      value: Array.from(
        new Map(
          bookings.value.map((item) => [item.customerName, item])
        ).values()
      ).sort((a, b) => a.customerName.localeCompare(b.customerName)).length,
      change: "+15.3%",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      color: "purple",
    },
    {
      title: "Services Completed",
      value: bookings.value.filter((bb) => bb.status === "complete").length,
      change: "+6.7%",
      icon: <Car className="h-8 w-8 text-orange-600" />,
      color: "orange",
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-sm ${
                    stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "purple"
                      ? "text-purple-600"
                      : "text-orange-600"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Bookings
          </h3>
          <div className="space-y-4">
            {bookings.value
              .filter((booking) => {
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

                const bookingTime = booking.time.toDate(); // convert from Firestore Timestamp
                return bookingTime >= threeDaysAgo;
              })
              .map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.service
                        .split(",")
                        .map((id) => {
                          return services.find((fs) => fs.id === id)?.title;
                        })
                        .join(",")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.id} • {booking.time.toDate().toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      TZSH {booking.amount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-blue-900 font-medium">
                View Today's Bookings
              </span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <CreditCard className="h-6 w-6 text-green-600" />
              <span className="text-green-900 font-medium">
                Process Payments
              </span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Users className="h-6 w-6 text-purple-600" />
              <span className="text-purple-900 font-medium">
                Customer Management
              </span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <BarChart3 className="h-6 w-6 text-orange-600" />
              <span className="text-orange-900 font-medium">
                Generate Reports
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user.value) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        You currently have no authorization to access this page{" "}
        <a href="/auth" className="underline text-blue-500 mx-1">
          LOGIN
        </a>{" "}
        to Continue
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b fixed top-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="/2star logo.jpg"
                alt="2Star Car Wash"
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-900">
                2Star Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Sheet>
                <SheetTrigger>
                  <div className="relative">
                    {notifications.value.filter(
                      (n) =>
                        (n.target === auth.currentUser?.uid ||
                          n.target === "" ||
                          n.target === "admin") &&
                        !n.seen.includes(auth.currentUser?.uid ?? "")
                    ).length > 0 && (
                      <div
                        className="absolute bottom-4 right-4 h-4 w-4 ml-3 bg-white text-black text-sm rounded-full border border-border shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform
        "
                      >
                        {
                          notifications.value
                            .filter(
                              (n) =>
                                n.target === auth.currentUser?.uid ||
                                n.target === "" ||
                                n.target === "admin"
                            )
                            .filter(
                              (n) =>
                                !n.seen.includes(auth.currentUser?.uid ?? "")
                            ).length
                        }
                      </div>
                    )}
                    <div
                      className="h-7 w-7 mr-5 bg-orange-500 rounded-full border border-border shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform text-white
        "
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                  </SheetHeader>{" "}
                  <div className="flex w-full max-w-md flex-col gap-2 p-2">
                    {notifications.value.filter(
                      (n) =>
                        n.target === auth.currentUser?.uid ||
                        n.target === "" ||
                        n.target === "admin"
                    ).length === 0 && (
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        No new notifications
                      </div>
                    )}
                    {notifications.value
                      .filter(
                        (n) =>
                          n.target === auth.currentUser?.uid ||
                          n.target === "" ||
                          n.target === "admin"
                      )
                      .map((notification) => (
                        <Item variant="outline">
                          <ItemContent>
                            <ItemTitle
                              className={
                                notification.seen.includes(
                                  auth.currentUser?.uid ?? ""
                                )
                                  ? "text-muted-foreground"
                                  : "text-foreground font-bold"
                              }
                            >
                              {notification.subject}
                            </ItemTitle>
                            <ItemDescription>
                              {notification.content}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions className="flex flex-col gap-2 items-end">
                            <div>
                              {notification.createdAt.toDate().toLocaleString()}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                //mark it as seen if not already
                                markNotificationAsSeen(notification.id);

                                if (
                                  !notification.seen.includes(
                                    auth.currentUser?.uid ?? ""
                                  )
                                ) {
                                  notification.seen.push(
                                    auth.currentUser?.uid ?? ""
                                  );
                                }
                                if (notification.externalLink) {
                                  window.open(notification.intent, "_blank");
                                } else {
                                  navigate(notification.intent);
                                }
                              }}
                            >
                              View
                            </Button>
                          </ItemActions>
                        </Item>
                      ))}
                  </div>
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {userInfo.value?.firstname[0]}
                        {userInfo.value?.lastname[0]}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {userInfo.value?.firstname} .{userInfo.value?.lastname[0]}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      location.href = "/admin";
                    }}
                  >
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-15">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "payments" && <PaymentManagement />}
          {activeTab === "bookings" && (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <PriceSetting
                open={priceSettingId.value !== ""}
                onClose={() => {
                  priceSettingId.value = "";
                }}
              />
              ;
              <DataTable
                columns={bookingsColumns}
                searchHint="Search By ID example 2SW-3..."
                searchKey="id"
                data={bookings.value}
              />
            </div>
          )}
          {activeTab === "customers" && (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <DataTable
                columns={customersColumns}
                searchHint="Search By Name..."
                searchKey="customerName"
                data={Array.from(
                  new Map(
                    bookings.value.map((item) => [item.customerName, item])
                  ).values()
                ).sort((a, b) => a.customerName.localeCompare(b.customerName))}
              />
            </div>
          )}
          {activeTab === "settings" && (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Settings
              </h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
