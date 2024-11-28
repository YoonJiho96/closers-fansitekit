// src/components/ImageTable.js
import React, { useState, useEffect } from 'react';

// ImageTable 컴포넌트는 images와 setImages를 props로 받습니다.
function ImageTable({ images, setImages }) {
  const [editIndex, setEditIndex] = useState(null); // 현재 편집 중인 행의 인덱스
  const [editCharacter, setEditCharacter] = useState(''); // 편집 중인 캐릭터 이름
  const [editTheme, setEditTheme] = useState(''); // 편집 중인 테마 이름
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false); // 미지정 이미지만 보기 옵션

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 아이템 수

  // 캐릭터 이름 목록 (오타 방지 및 일관성 유지를 위해 사용)
  const characterNames = [
    '세하', '슬비', '유리', '제이', '미스틸테인', '리아',
    '나타', '레비아', '하피', '티나', '바이올렛',
    '볼프강', '루나', '소마', '파이', '세트',
    '김철수', '미래', '은하', '루시', '애리',
    '미지정',
  ];

  // 테마 이름 목록 추출 (images 데이터에서 고유한 테마 이름을 수집)
  const themeNames = Array.from(new Set(images.map((image) => image.theme)));

  // 필터 상태
  const [selectedCharacter, setSelectedCharacter] = useState('전체');
  const [selectedTheme, setSelectedTheme] = useState('전체');

  // 편집 모드로 전환하는 함수
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditCharacter(images[index].character);
    setEditTheme(images[index].theme);
  };

  // 편집 내용을 저장하는 함수
  const handleSave = (index) => {
    const updatedImages = [...images];
    updatedImages[index].character = editCharacter;
    updatedImages[index].theme = editTheme;
    setImages(updatedImages);
    setEditIndex(null);
  };

  // 편집을 취소하는 함수
  const handleCancel = () => {
    setEditIndex(null);
  };

  // 필터링된 이미지 목록 생성
  const filteredImages = images.filter((image) => {
    const characterMatch =
      selectedCharacter === '전체' || image.character === selectedCharacter;
    const themeMatch = selectedTheme === '전체' || image.theme === selectedTheme;
    const unassignedMatch = showUnassignedOnly
      ? image.character === '미지정' || image.theme === '미지정'
      : true;
    return characterMatch && themeMatch && unassignedMatch;
  });

  // 페이지네이션 적용
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 데이터 다운로드 함수
  const downloadData = () => {
    const dataStr = JSON.stringify(images, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'images.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 필터 변경 시 페이지를 첫 페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCharacter, selectedTheme, showUnassignedOnly, itemsPerPage]);

  return (
    <div>
      {/* 캐릭터 및 테마 필터 */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          캐릭터:
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            style={{ marginRight: '20px', marginLeft: '5px' }}
          >
            <option value="전체">전체</option>
            {characterNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          테마:
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            style={{ marginLeft: '5px' }}
          >
            <option value="전체">전체</option>
            {themeNames.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 미지정 이미지만 보기 옵션 */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={showUnassignedOnly}
            onChange={(e) => setShowUnassignedOnly(e.target.checked)}
          />
          미지정 이미지만 보기
        </label>
      </div>

      {/* 페이지당 아이템 수 선택 */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          페이지당 표시할 아이템 수:{' '}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10개</option>
            <option value={25}>25개</option>
            <option value={50}>50개</option>
            <option value={100}>100개</option>
          </select>
        </label>
      </div>

      {/* 데이터 다운로드 버튼 */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={downloadData}>데이터 저장 및 다운로드</button>
      </div>

      {/* 이미지 테이블 */}
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>썸네일</th>
            <th>캐릭터</th>
            <th>테마</th>
            <th>편집</th>
          </tr>
        </thead>
        <tbody>
          {currentImages.map((image, index) => {
            const actualIndex = images.findIndex((img) => img.id === image.id);
            return (
              <tr
                key={image.id}
                style={{
                  backgroundColor:
                    image.character === '미지정' || image.theme === '미지정' ? '#ffe6e6' : 'white',
                }}
              >
                <td>
                  <img
                    src={encodeURI(`${process.env.PUBLIC_URL}/${image.thumbnailPath}`)}
                    alt={`썸네일 ${image.id}`}
                    style={{ width: '100px', height: 'auto' }}
                  />
                </td>
                {editIndex === actualIndex ? (
                  // 편집 모드일 때
                  <>
                    <td>
                      <select
                        value={editCharacter}
                        onChange={(e) => setEditCharacter(e.target.value)}
                      >
                        {characterNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editTheme}
                        onChange={(e) => setEditTheme(e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(actualIndex)}>저장</button>
                      <button onClick={handleCancel}>취소</button>
                    </td>
                  </>
                ) : (
                  // 일반 모드일 때
                  <>
                    <td>{image.character}</td>
                    <td>{image.theme}</td>
                    <td>
                      <button onClick={() => handleEdit(actualIndex)}>편집</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            style={{
              margin: '0 5px',
              backgroundColor: currentPage === number ? '#4CAF50' : '#e7e7e7',
              color: currentPage === number ? 'white' : 'black',
              border: 'none',
              padding: '5px 10px',
            }}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageTable;
