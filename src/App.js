// src/App.js
import React, { useState, useEffect } from 'react';
import imageData from './data/images.json';
import ImageTable from './components/ImageTable';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 데이터를 불러옵니다.
    const savedData = JSON.parse(localStorage.getItem('imagesData'));
    const savedTimestamp = localStorage.getItem('imagesDataTimestamp');

    const currentTimestamp = imageData.timestamp;

    if (savedData) {
      if (savedTimestamp === currentTimestamp) {
        // 로컬 스토리지의 데이터가 최신인 경우
        setImages(savedData);
      } else {
        // 데이터 병합 로직
        const mergedData = imageData.images.map((newItem) => {
          const savedItem = savedData.find((item) => item.id === newItem.id);
          return savedItem ? savedItem : newItem;
        });
        setImages(mergedData);
        // 로컬 스토리지 업데이트
        localStorage.setItem('imagesData', JSON.stringify(mergedData));
        localStorage.setItem('imagesDataTimestamp', currentTimestamp);
      }
    } else {
      // 로컬 스토리지에 데이터가 없는 경우
      setImages(imageData.images);
      localStorage.setItem('imagesData', JSON.stringify(imageData.images));
      localStorage.setItem('imagesDataTimestamp', currentTimestamp);
    }
  }, []);

  // images 상태가 변경될 때마다 로컬 스토리지에 저장합니다.
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem('imagesData', JSON.stringify(images));
      // 로컬에서 편집한 데이터이므로 타임스탬프는 변경하지 않습니다.
    }
  }, [images]);

  return (
    <div>
      <h1>이미지 관리</h1>
      <ImageTable images={images} setImages={setImages} />
    </div>
  );
}

export default App;
