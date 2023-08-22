import React, { useEffect, useState } from 'react'
import Button from './Button'

function Confirm({onConfirm, onCancel, message, style, ShowModal}) {
    const [show,setShow] = useState(false);

    useEffect(()=>{
        setShow(ShowModal);
    }, [ShowModal]);

    const closeModal = (e) => {
        setShow(false);
        onCancel(e);
    }
    return (
        <div className={`confirm-modal-parent ${!show?'hidden':''}`}>
            <div id='confirm-sticky-modal' className={`confirm-modal ${style}`}>
                <h5>Action Required</h5>
                <p>{message}</p>
                <div className='flex'>
                    <Button onClick={onConfirm} title='Confirm action'>Confirm</Button>
                    <Button onClick={closeModal} title='Cancel action'>Cancel</Button>
                </div>
            </div>
        </div>
    )
}

export default Confirm