import { useState } from 'react'
// import AddReleaseForm from '../pages/Release/AddReleaseForm'

const AddReleaseButton = () => {
    const [open, openChange] = useState(false)
    const functionOpenPopup = () => {
        openChange(true)
    }
    const closePopup = () => {
        openChange(false)
    }

    return (
        <>
            {/* <AddReleaseForm
                onClick={functionOpenPopup}
                open={open}
                closePopup={closePopup}
            /> */}
        </>
    )
}

export default AddReleaseButton
