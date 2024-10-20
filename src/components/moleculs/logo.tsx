import { Film } from "lucide-react"
import { Link } from "react-router-dom"

const Logo = () => {
    return (
        <Link to="/" className="mr-6 flex items-center space-x-2">
            <Film className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
                MovieDB
            </span>
        </Link>
    )
}

export default Logo