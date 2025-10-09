import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Wallet,
    FileText,
    Users,
    Store,
    ShoppingBag,
    User,
    Settings,
    Menu,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import storage from "@/utils/Storage";
import { isTokenExpired, isNotNullUndefinedBlank } from "../helpers/Common";
import { useNavigate } from "react-router-dom";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    // { icon: Package, label: "Inward", path: "/inward" },
    // { icon: ShoppingCart, label: "Outward/Sale", path: "/outward" },
    // { icon: Wallet, label: "Vendor Payment", path: "/vendor-payment" },
    // { icon: Wallet, label: "Payment Received", path: "/payment-received" },
    // { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Users, label: "Vendor Master", path: "/vendors" },
    { icon: Store, label: "Party Master", path: "/parties" },
    { icon: ShoppingBag, label: "Item Master", path: "/items" },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = storage.getToken();
        if (isTokenExpired(token)) {
            window.localStorage.clear();
            navigate("/login");
            return;
        }

    }, [navigate])

    const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
        <>
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-foreground hover:bg-muted"
                        )}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                );
            })}
        </>
    );

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Top Navbar */}
            <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Mobile Menu Toggle */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="p-6 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                                        <Store className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-foreground">Avinya Fashion</h1>
                                        <p className="text-xs text-muted-foreground">Inventory</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-3 space-y-1">
                                <NavItems onItemClick={() => setIsMobileMenuOpen(false)} />
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary rounded-lg flex items-center justify-center">
                        <Store className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-xl font-bold text-foreground">Ishita Fashion</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">Inventory Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    storage.clearToken();
                                    storage.clearUser();
                                    navigate("/login");
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 bg-card border-r border-border overflow-y-auto">
                    <nav className="p-3 space-y-1">
                        <NavItems />
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-muted/30">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
};
