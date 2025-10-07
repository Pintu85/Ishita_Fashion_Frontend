import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, Store, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const todayStats = [
    {
      title: "Sales Bills Created",
      value: "12",
      amount: "₹45,230",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Inward Done",
      value: "8",
      amount: "₹32,450",
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "New Parties Added",
      value: "3",
      icon: Store,
      color: "text-purple-600",
    },
    {
      title: "Stock Value",
      value: "₹8,45,670",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Today's Activity - {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
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
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">Party {i}</p>
                    <p className="text-sm text-muted-foreground">
                      Bill #{1000 + i}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(15000 + i * 1000).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inwards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">Vendor {i}</p>
                    <p className="text-sm text-muted-foreground">
                      Challan #{500 + i}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(12000 + i * 800).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;
