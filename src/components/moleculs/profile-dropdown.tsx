import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/atom/dropdown-menu";
import { Button } from "../atom/button";
import { LogOutIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutFromTMDB, getAccountDetails } from "@/services/apis/auth"; // Import fungsi logout dan API
import { useToast } from "@/hooks/use-toast";
import { IUser } from "@/services/apis/interface";

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [account, setAccount] = useState<IUser | null>(null); // State untuk menyimpan informasi akun
    const sessionId = localStorage.getItem("session_id");

    // Ambil informasi akun ketika dropdown dibuka
    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (sessionId) {
                try {
                    const accountData = await getAccountDetails(sessionId);
                    setAccount(accountData);
                } catch (error) {
                    console.error("Error fetching account details:", error);
                    toast({
                        title: "Error",
                        description: "Failed to load account details.",
                        variant: "destructive",
                    });
                }
            }
        };

        fetchAccountDetails();
    }, [sessionId, toast]);

    // Fungsi untuk handle logout
    const handleLogout = async () => {
        try {
            if (sessionId) {
                await logoutFromTMDB(sessionId); // Panggil API logout
                localStorage.removeItem("session_id"); // Hapus session_id dari localStorage
                toast({
                    title: "Logged out",
                    description: "You have been logged out successfully.",
                });
                navigate("/login"); // Arahkan ke halaman login setelah logout
            } else {
                toast({
                    title: "No session found",
                    description: "You are not logged in.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error logging out:", error);
            toast({
                title: "Error",
                description: "Failed to log out. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {/* Ganti "My Account" dengan nama akun */}
                <DropdownMenuLabel>
                    {account ? `${account.username}` : "Hello, Guest"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to={"/favorite"}>
                        Favorite Movies
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Button variant={"destructive"} onClick={handleLogout}>
                        <span>Logout</span>
                        <span>
                            <LogOutIcon />
                        </span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileDropdown;
