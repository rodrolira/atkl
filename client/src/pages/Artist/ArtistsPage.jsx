// ArtistsPage.jsx
import React from 'react'
import Navbar from '@/components/Navbar/Navbar'
import ArtistsSection from '@/components/sections/ArtistsSection' 
function ArtistsPage({ artistsData }) {
    return (
        <div>
            <Navbar />
            <div className="my-12 lg:my-16">
                <ArtistsSection artistsData={artistsData} />
            </div>
        </div>
    )
}

export default ArtistsPage
