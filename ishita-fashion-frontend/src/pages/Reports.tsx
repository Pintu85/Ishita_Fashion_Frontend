import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPartyDropdown } from "@/interfaces/party/Party";
import { IResponseModel } from "@/interfaces/ResponseModel";
import { useGetPartiesWithoutFilter } from "@/services/party/Party.Service";
import { Combobox } from "@/components/ui/combobox";
import { Download, RefreshCw, Funnel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetPartiesReport, useGetVendorInwardsReport, useGetStockReport, useGetDashboardReport, } from "@/services/reports/Report.Service";
import { Pagination } from "@/components/ui/pagination";
import { IPartyReport, IVendorInwardsReport, IDashboardReport, IStockReport } from "@/interfaces/report/Reports";
import { IVendorDropdown } from "@/interfaces/vendor/Vendor";
import { useGetVendorsWithoutFilter } from "@/services/vendor/Vendor.Service";

const Reports = () => {
  const [parties, setParties] = useState<IPartyDropdown[]>([]);
  const [partiesReport, setPartiesReport] = useState<IPartyReport[]>([]);
  const [vendorinwardsReport, setVendorinwardsReport] = useState<IVendorInwardsReport[]>([]);
  const [dashboardData, setDashboardData] = useState<IDashboardReport>();
  const [stockReportData, setStockReportData] = useState<IStockReport[]>([]);
  const [vendors, setVendors] = useState<IVendorDropdown[]>([]);
  const { toast } = useToast();
  const pageNumber = useRef(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [partySearch, setPartySearch] = useState<string>("");
  const [vendorInwardSearch, setVendorInwardSearch] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("party-sales");

  useEffect(() => {
    if (activeTab === "party-sales") {
      getpartiesDropDownList();
      getPartiesReport();
    }

    if (activeTab === "vendor-inward") {
      getVendorInwardsReport();
      getvendorsDropDownList();
    }

    if (activeTab === "dashboard") {
      getDashboardReport();
    }

    if (activeTab === "stock") {
      getStockReports();
    }

  }, [activeTab])

  const getvendorsDropDownList = () => {
    getVendorsMutation.mutate({});
  };

  const getVendorsMutation = useGetVendorsWithoutFilter({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setVendors(res.data);
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const getpartiesDropDownList = () => {
    getPartiesMutation.mutate({});
  };

  const getPartiesMutation = useGetPartiesWithoutFilter({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {

        setParties(res.data);
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const handlePageChange = (newPage: number) => {
    pageNumber.current = newPage;
    let size = pageSize;
    setPageSize(size);
    getPartiesReport();
  };

  const getPartiesReport = () => {
    getPartyReportsMutation.mutate({ searchFilter: partySearch, pageNumber: pageNumber.current, pageSize: pageSize, fromDate: "", toDate: "" })
  }
  const getPartyReportsMutation = useGetPartiesReport({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setPartiesReport(res.data.records);
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const getDashboardReport = () => {
    getDashboardReportsMutation.mutate({})
  }
  const getDashboardReportsMutation = useGetDashboardReport({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setDashboardData(res.data);
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const getStockReports = () => {
    getStockReportsMutation.mutate({})
  }
  const getStockReportsMutation = useGetStockReport({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setStockReportData(res.data.records);
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const getVendorInwardsReport = () => {
    getVendorInwardsReportMutation.mutate({ searchFilter: partySearch, pageNumber: pageNumber.current, pageSize: pageSize, fromDate: "", toDate: "" })
  }

  const getVendorInwardsReportMutation = useGetVendorInwardsReport({
    onSuccess: (res: IResponseModel) => {
      if (res.statusCode === 200) {
        setVendorinwardsReport(res.data.records);
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
      }
    },
    onError: (err: any) => {
      const errorMsg =
        err?.response?.data?.statusMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast({
        title: "Error occurred",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const handlePartySearchApply = () => {
    getPartyReportsMutation.mutate({
      searchFilter: partySearch,
      pageNumber: pageNumber.current,
      pageSize: pageSize,
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  const handlepartySerachReset = () => {
    setPartySearch("");
    setFromDate("");
    setToDate("");
    pageNumber.current = 1;
    getPartyReportsMutation.mutate({
      searchFilter: "",
      pageNumber: 1,
      pageSize: pageSize,
      fromDate: "",
      toDate: "",
    });
  };

  const handleVendorInwardSearchApply = () => {
    getVendorInwardsReportMutation.mutate({
      searchFilter: vendorInwardSearch,
      pageNumber: pageNumber.current,
      pageSize: pageSize,
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  const handleVendorInwardSerachReset = () => {
    setVendorInwardSearch("");
    setFromDate("");
    setToDate("");
    pageNumber.current = 1;
    getVendorInwardsReportMutation.mutate({
      searchFilter: "",
      pageNumber: 1,
      pageSize: pageSize,
      fromDate: "",
      toDate: "",
    });
  };

  // Export functions
  const convertToCSV = (data: any[], headers: string[]) => {
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        const escaped = ('' + value).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];

      switch (activeTab) {
        case 'party-sales':
          if (partiesReport.length === 0) {
            toast({
              title: "No data to export",
              description: "There are no records to export",
              variant: "destructive",
            });
            return;
          }

          const partyData = partiesReport.map(party => ({
            'Party Name': party.partyName,
            'Total Bills': party.totalBillCount || 0,
            'Total Amount': party.totalBilledAmount || 0,
            'Paid': party.totalAmountReceived || 0,
            'Due': party.totalDue || 0,
          }));

          const partyCSV = convertToCSV(
            partyData,
            ['Party Name', 'Total Bills', 'Total Amount', 'Paid', 'Due']
          );
          downloadCSV(partyCSV, `Party_Sales_Report_${currentDate}.csv`);

          toast({
            title: "Export Successful",
            description: "Party sales report has been exported",
          });
          break;

        case 'vendor-inward':
          if (vendorinwardsReport.length === 0) {
            toast({
              title: "No data to export",
              description: "There are no records to export",
              variant: "destructive",
            });
            return;
          }

          const vendorData = vendorinwardsReport.map(vendor => ({
            'Vendor Name': vendor.vendorName,
            'Quantity': vendor.totalInwardQuantity,
            'Total Amount': vendor.totalPurchasedAmount,
            'Paid': vendor.totalAmountPaid,
            'Due': vendor.totalDue,
          }));

          const vendorCSV = convertToCSV(
            vendorData,
            ['Vendor Name', 'Quantity', 'Total Amount', 'Paid', 'Due']
          );
          downloadCSV(vendorCSV, `Vendor_Inward_Report_${currentDate}.csv`);

          toast({
            title: "Export Successful",
            description: "Vendor inward report has been exported",
          });
          break;

        case 'stock':
          if (stockReportData.length === 0) {
            toast({
              title: "No data to export",
              description: "There are no records to export",
              variant: "destructive",
            });
            return;
          }

          const stockData = stockReportData.map(stock => ({
            'Design No': stock.designNo,
            'Design Name': stock.designNo,
            'Quantity': stock.totalQuantity,
            'Cost/Piece': stock.cost,
            'Total Value': stock.totalValue,
          }));

          const stockCSV = convertToCSV(
            stockData,
            ['Design No', 'Design Name', 'Quantity', 'Cost/Piece', 'Total Value']
          );
          downloadCSV(stockCSV, `Stock_Report_${currentDate}.csv`);

          toast({
            title: "Export Successful",
            description: "Stock report has been exported",
          });
          break;

        case 'dashboard':
          if (!dashboardData) {
            toast({
              title: "No data to export",
              description: "There is no dashboard data to export",
              variant: "destructive",
            });
            return;
          }

          const dashboardExport = [
            {
              'Metric': 'Sales Bills Created',
              'Count': dashboardData.totalBillCount,
              'Amount': dashboardData.totalBillAmount,
            },
            {
              'Metric': 'Inward Entries',
              'Count': dashboardData.totalInwardCount,
              'Amount': dashboardData.totalInwardAmount,
            },
            {
              'Metric': 'New Parties Added',
              'Count': dashboardData.totalPartyCount,
              'Amount': '-',
            },
            {
              'Metric': 'Payments Received',
              'Count': '-',
              'Amount': dashboardData.billPaymentAmount,
            },
            {
              'Metric': 'Vendor Payments Made',
              'Count': '-',
              'Amount': dashboardData.vendorPayment,
            },
          ];

          const dashboardCSV = convertToCSV(
            dashboardExport,
            ['Metric', 'Count', 'Amount']
          );
          downloadCSV(dashboardCSV, `Dashboard_Report_${currentDate}.csv`);

          toast({
            title: "Export Successful",
            description: "Dashboard report has been exported",
          });
          break;

        default:
          toast({
            title: "Export Failed",
            description: "Unknown report type",
            variant: "destructive",
          });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting data",
        variant: "destructive",
      });
      console.error('Export error:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">
          View and analyze your business data
        </p>
      </div>

      <Tabs defaultValue="party-sales" className="space-y-6" value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full max-w-2xl grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="party-sales" className="text-xs sm:text-sm">Party Sales</TabsTrigger>
          <TabsTrigger value="vendor-inward" className="text-xs sm:text-sm">Vendor Inward</TabsTrigger>
          <TabsTrigger value="stock" className="text-xs sm:text-sm">Stock</TabsTrigger>
          <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="party-sales">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg sm:text-xl">Party-wise Sales Report</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Party Combobox */}
                <div className="space-y-2">
                  <Label htmlFor="party">Party</Label>
                  <Combobox
                    options={(parties || []).map((party) => ({
                      value: party.partyID,
                      label: `${party.partyName}${party.mobileNo ? ` - ${party.mobileNo}` : ''}`,
                    }))}
                    value={partySearch}
                    onValueChange={(val) => {
                      setPartySearch(val);
                    }}
                    placeholder="Select party"
                    searchPlaceholder="Search party..."
                  />
                </div>

                {/* From Date */}
                <div className="space-y-2">
                  <Label htmlFor="from-date">From Date</Label>
                  <Input
                    id="from-date"
                    type="date"
                    value={fromDate || ""}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <Label htmlFor="to-date">To Date</Label>
                  <Input
                    id="to-date"
                    type="date"
                    value={toDate || ""}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="">Filter</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handlepartySerachReset}
                      className="flex items-center gap-1 w-full"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handlePartySearchApply}
                      className="flex items-center gap-1 w-full"
                    >
                      <Funnel className="h-4 w-4" />
                      <span className="hidden sm:inline">Apply</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* ✅ Responsive Table Wrapper */}
              <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Party Name</TableHead>
                      <TableHead>Total Bills</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partiesReport && partiesReport.length > 0 ? (
                      partiesReport.map((party, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{party.partyName}</TableCell>
                          <TableCell>{party.totalBillCount || "-"}</TableCell>
                          <TableCell>₹{party.totalBilledAmount || "0"}</TableCell>
                          <TableCell className="text-green-600">₹{party.totalAmountReceived || "0"}</TableCell>
                          <TableCell className="text-orange-600">₹{party.totalDue || "0"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                totalCount={totalPages}
                currentPage={pageNumber.current}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="vendor-inward">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg sm:text-xl">Vendor-wise Inward Report</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Combobox
                    options={vendors.map((x: any) => ({
                      value: x.vendorID,
                      label: `${x.vendorName}${x.mobileNo ? ` - ${x.mobileNo}` : ''}`,
                    }))}
                    value={vendorInwardSearch}
                    onValueChange={(val) => {
                      setVendorInwardSearch(val);
                    }}
                    placeholder="Select vendor"
                    searchPlaceholder="Search vendor..."
                  />

                </div>
                {/* From Date */}
                <div className="space-y-2">
                  <Label htmlFor="from-date">From Date</Label>
                  <Input
                    id="from-date"
                    type="date"
                    value={fromDate || ""}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <Label htmlFor="to-date">To Date</Label>
                  <Input
                    id="to-date"
                    type="date"
                    value={toDate || ""}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2 flex flex-col justify-end">
                  <Label className="">Filter</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleVendorInwardSerachReset}
                      className="flex items-center gap-1 w-full"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleVendorInwardSearchApply}
                      className="flex items-center gap-1 w-full"
                    >
                      <Funnel className="h-4 w-4" />
                      <span className="hidden sm:inline">Apply</span>
                    </Button>
                  </div>
                </div>

              </div>

              {/* ✅ Responsive table wrapper */}
              <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {vendorinwardsReport && vendorinwardsReport.length > 0 ? vendorinwardsReport.map((vendor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                        <TableCell>{vendor.totalInwardQuantity}</TableCell>
                        <TableCell>{vendor.totalPurchasedAmount}</TableCell>
                        <TableCell className="text-green-600">{vendor.totalAmountPaid}</TableCell>
                        <TableCell className="text-orange-600">{vendor.totalDue}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )
                    }
                  </TableBody>
                </Table>
              </div>
              <Pagination
                totalCount={totalPages}
                currentPage={pageNumber.current}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg sm:text-xl">Stock Report</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Total Stock Value</p>
                  <p className="text-2xl sm:text-4xl font-bold text-primary">₹8,45,670</p>
                </div>
              </div>

              {/* ✅ Responsive table wrapper */}
              <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Design No</TableHead>
                      <TableHead>Design Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost/Piece</TableHead>
                      <TableHead>Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockReportData && stockReportData.length > 0 ? stockReportData.map((stock, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{stock.designNo}</TableCell>
                        <TableCell>{stock.designNo}</TableCell>
                        <TableCell>{stock.totalQuantity}</TableCell>
                        <TableCell>₹{stock.cost}</TableCell>
                        <TableCell className="font-semibold">₹{stock.totalValue}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  Today's Activity Dashboard
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {dashboardData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Sales Bills */}
                  <div className="p-5 bg-secondary/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Sales Bills Created</p>
                        <p className="text-2xl font-bold mt-1">{dashboardData.totalBillCount} Bills</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                          ₹{dashboardData.totalBillAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inward Entries */}
                  <div className="p-5 bg-secondary/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Inward Entries</p>
                        <p className="text-2xl font-bold mt-1">{dashboardData.totalInwardCount} Entries</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                          ₹{dashboardData.totalInwardAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* New Parties */}
                  <div className="p-5 bg-secondary/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <p className="text-sm text-muted-foreground">New Parties Added</p>
                    <p className="text-2xl font-bold mt-1">{dashboardData.totalPartyCount} Parties</p>
                  </div>

                  {/* Payments Received */}
                  <div className="p-5 bg-secondary/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <p className="text-sm text-muted-foreground">Payments Received</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      ₹{dashboardData.billPaymentAmount}
                    </p>
                  </div>

                  {/* Vendor Payments */}
                  <div className="p-5 bg-secondary/50 rounded-2xl shadow-sm hover:shadow-md transition-all sm:col-span-2 lg:col-span-3">
                    <p className="text-sm text-muted-foreground">Vendor Payments Made</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      ₹{dashboardData.vendorPayment}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No data available for today.
                </div>
              )}
            </CardContent>
          </Card>

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;