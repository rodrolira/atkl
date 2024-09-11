import { useState } from 'react'
// import AddArtistForm from '../pages/Artist/AddArtistForm' // Importa el formulario de agregar artista

const AddArtistButton = () => {
    const [open, openChange] = useState(false)
    const functionOpenPopup = () => {
        openChange(true)
    }
    const closePopup = () => {
        openChange(false)
    }

    return (
        <>
            {/* <AddArtistForm
                onClick={functionOpenPopup}
                open={open}
                closePopup={closePopup}
            /> */}
        </>
    )
}

export default AddArtistButton
