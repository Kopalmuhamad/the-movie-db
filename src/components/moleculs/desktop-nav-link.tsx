import { Link } from "react-router-dom"

const DesktopNavLink = () => {
    return (
        <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/movies">Movies</Link>
            <Link to="/tv-shows">TV Shows</Link>
        </nav>
    )
}

export default DesktopNavLink