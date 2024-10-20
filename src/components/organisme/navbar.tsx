import Logo from "../moleculs/logo"
import DesktopNavLink from "../moleculs/desktop-nav-link"
import MobileNavLink from "../moleculs/mobile-nav-link"
import { ModeToggle } from "../moleculs/mode-toggle"
import SearchInput from "../moleculs/search-input"
import ProfileDropdown from "../moleculs/profile-dropdown"
import { useEffect, useRef, useState } from "react"
import { Button } from "../atom/button"
import { LogInIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const sessionId = localStorage.getItem("session_id")
        if (sessionId) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false)
            }
        }

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        } else {
            document.removeEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isSearchOpen])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center px-1">
                <div className="mr-4 hidden md:flex">
                    <Logo />
                    <DesktopNavLink />
                </div>
                <MobileNavLink />
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <SearchInput />
                    <ModeToggle />
                    {isLoggedIn ? <ProfileDropdown /> :
                        <Button
                            onClick={() => {
                                localStorage.removeItem('guest_session_id');
                                navigate('/login');
                            }}
                            className="bg-transparent"
                            variant={"outline"}
                        >
                            <span><LogInIcon /></span>
                            <span>Login</span>
                        </Button>}
                </div>
            </div>
        </header>
    )
}
