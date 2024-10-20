import { Sheet, SheetContent, SheetTrigger } from '../atom/sheet'
import { Film, MenuIcon, Tv } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../atom/button'

const MobileNavLink = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <Link to="/" className="flex items-center">
                    <Film className="mr-2 h-4 w-4" />
                    <span className="font-bold">MovieDB</span>
                </Link>
                <nav className="mt-6 flex flex-col space-y-4">
                    <Link to="/movies" className="flex items-center">
                        <Film className="mr-2 h-4 w-4" />
                        Movies
                    </Link>
                    <Link to="/tv-shows" className="flex items-center">
                        <Tv className="mr-2 h-4 w-4" />
                        TV Shows
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNavLink