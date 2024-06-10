import React, { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';


const TabImagesComponent = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {
                images?.length > 0 && <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '600px', marginBottom: '20px' }}>

                        <div style={{ fontSize: '20px', cursor: 'pointer', marginRight: '20px' }} onClick={handlePrevClick}><LeftOutlined /></div>
                        <img src={images[currentImageIndex]} alt={`Image ${currentImageIndex}`} style={{ width: '500px', objectFit: 'cover', maxHeight: '300px' }} />
                        <div style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '20px' }} onClick={handleNextClick}><RightOutlined /></div>
                    </div>
                    <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index}`}
                                onClick={() => handleThumbnailClick(index)}
                                style={{ width: '50px', height: 'auto', cursor: 'pointer', margin: '0 5px', border: index === currentImageIndex ? '2px solid red' : 'none' }}
                            />
                        ))}
                    </div>
                </>
            }
        </div>
    );
};

export default TabImagesComponent;
