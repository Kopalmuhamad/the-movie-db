import React from 'react'
import Navbar from '../organisme/navbar'

interface IProps {
    children: React.ReactNode
}

const MainLayout = ({ children }: IProps) => {
    return (
        <React.Fragment>
            <Navbar />
            {children}
        </React.Fragment>
    )
}

export default MainLayout