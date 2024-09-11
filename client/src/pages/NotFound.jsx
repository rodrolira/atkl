import React from 'react'
import Navbar from '@/components/Navbar/Navbar'

const NotFound = () => {
    return (
        <>
            <Navbar />
            <div className='my-20 lg:my-24'>
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for could not be found.</p>
            </div>
        </>
    )
}

export default NotFound
