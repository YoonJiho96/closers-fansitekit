// src/App.js
import React, { useState, useEffect } from 'react';
import imageData from './data/images.json';
import ImageTable from './components/ImageTable';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // images.json의 데이터를 직접 사용하여 상태를 설정합니다.
    setImages(imageData.images);
  }, []);

  return (
    <div>
      <h1>이미지 관리</h1>
      <ImageTable images={images} setImages={setImages} />
    </div>
  );
}

export default App;
