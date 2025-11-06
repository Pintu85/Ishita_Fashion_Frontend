import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, Store, TrendingUp, Loader2, RefreshCw, Funnel } from "lucide-react";
import { useGetDashboardData } from "@/services/dashboard/dashboard.service";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const { toast } = useToast();
  const { mutate: getDashboardData, data: dashboardData } = useGetDashboardData({
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    },
  });

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Load default (today) when component mounts
    getDashboardData(undefined);
  }, []);

  const todayStats = [
    {
      title: "Sales Bills Created",
      value: dashboardData?.data?.totalBillCount ?? "0",
      amount: `₹${dashboardData?.data?.totalBillAmount?.toLocaleString() ?? "0"}`,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Inward Done",
      value: dashboardData?.data?.totalInwardCount ?? "0",
      amount: `₹${dashboardData?.data?.totalInwardAmount?.toLocaleString() ?? "0"}`,
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "New Parties Added",
      value: dashboardData?.data?.totalPartyCount ?? "0",
      icon: Store,
      color: "text-purple-600",
    },
    {
      title: "Stock Value",
      value: `₹${dashboardData?.data?.totalStockValue?.toLocaleString() ?? "0"}`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-1">
          <p className="text-muted-foreground">
            Today's Activity - {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="flex items-end gap-3">
            <div className="space-y-1">
              <Label className="text-xs">From</Label>
              <Input
                type="date"
                value={fromDate}
                max={today} // Prevent future dates
                onChange={(e) => {
                  const selected = e.target.value;
                  setFromDate(selected);

                  // If toDate exists and is now before fromDate, reset it
                  if (toDate && selected && toDate < selected) {
                    setToDate("");
                    toast({
                      title: "Date Adjusted",
                      description: "End date reset because it was before the new start date.",
                      variant: "default",
                    });
                  }
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To</Label>
              <Input
                type="date"
                value={toDate}
                min={fromDate || undefined} // Enforce min based on fromDate
                max={today} // Prevent future dates
                onChange={(e) => {
                  const selected = e.target.value;
                  if (fromDate && selected < fromDate) {
                    toast({
                      title: "Invalid End Date",
                      description: "End date cannot be before start date.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setToDate(selected);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="h-10 bg-white text-foreground hover:bg-blue-600 hover:text-white border border-input rounded-md px-3"
                onClick={() => {
                  // Final validation before API call
                  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
                    toast({
                      title: "Invalid Date Range",
                      description: "Start date must be on or before the end date.",
                      variant: "destructive",
                    });
                    return;
                  }

                  const payload = fromDate || toDate
                    ? { fromDate: fromDate || undefined, toDate: toDate || undefined }
                    : undefined;

                  getDashboardData(payload as any);
                }}
              >
                <Funnel className="mr-2 h-4 w-4" />
                Apply
              </Button>
              <Button
                className="h-10 bg-white text-foreground hover:bg-blue-600 hover:text-white border border-input rounded-md px-3"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  getDashboardData(undefined);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                {stat.amount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount: {stat.amount}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.data?.billrecord?.map((bill) => (
                <div
                  key={bill.billID}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{bill.partyName}</p>
                    <p className="text-sm text-muted-foreground">
                      Bill #{bill.billNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{bill.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(bill.billDate).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {!dashboardData?.data?.billrecord?.length && (
                <p className="text-center text-muted-foreground">No sales records for selected period</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inwards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.data?.inwardrecord?.map((inward) => (
                <div
                  key={inward.inwardID}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{inward.vendorName}</p>
                    <p className="text-sm text-muted-foreground">
                      Challan #{inward.challanNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{inward.totalPurchaseAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(inward.inwardDate).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {!dashboardData?.data?.inwardrecord?.length && (
                <p className="text-center text-muted-foreground">No inward records for selected period</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {false && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;