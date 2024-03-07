import './App.css';
import './ImageGallery.css';

import React, {useState } from 'react';

function ImageGallery({ imgSrcList, setImgSrcList }) {
    const [selectedImg, setSelectedImg] = useState(null);
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const [imgToDelete, setImgToDelete] = useState("")

    const deletePicture = () => {
        setImgSrcList(imgSrcList.filter(imgSrc => imgSrc !== imgToDelete));
    }

    return (
        <div>
            {isConfirmationPopupOpen && (
                <div className="confirm-delete-modal">
                    <div className="confirm-delete-modal-inner">
                        <p>Are you sure you want to delete the picture?</p>
                        <button className="confirm-delete-button" onClick={() => {deletePicture(); setIsConfirmationPopupOpen(false);}}>Yes</button>
                        <button className="confirm-delete-button" onClick={() => setIsConfirmationPopupOpen(false)}>No</button>
                    </div>
              </div>
            )}

            {imgSrcList.length > 0 && (
                <div className="cards-container">
                    {imgSrcList.map((imgSrc, index) => (
                    <div key={index}>
                        <div className="captured-image-card">
                            <button className="delete" onClick={() => {setIsConfirmationPopupOpen(true); setImgToDelete(imgSrc); } }></button>
                            <img src={imgSrc} alt="Capture" onClick={() => setSelectedImg(imgSrc)} />
                            <div className="download-instructions">Click and hold the image to save it to your phone. Please ensure it's not blurry</div>
                        </div>
                    </div>
                    ))}
                </div>
            )}

            {/* Modal for the expanded image */}
            {selectedImg && (
                <div className="modal" onClick={() => setSelectedImg(null)}>
                <img src={selectedImg} alt="Expanded" className="modal-content" />
                </div>
            )}
        </div>
    );
}

export default ImageGallery;
