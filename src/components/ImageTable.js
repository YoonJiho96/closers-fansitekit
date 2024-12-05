import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // 접근성을 위해 설정

function ImageTable({ images, setImages }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editCharacter, setEditCharacter] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const characterGroups = {
    검은양: ['세하', '슬비', '유리', '제이', '미스틸테인', '리아'],
    늑대개: ['나타', '레비아', '하피', '티나', '바이올렛'],
    사냥터지기: ['볼프강', '루나', '소마', '파이', '세트'],
    시궁쥐: ['김철수', '미래', '은하', '루시', '애리'],
  };

  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const themeNames = Array.from(new Set(images.map((image) => image.theme)));
  const [selectedTheme, setSelectedTheme] = useState('전체');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleThumbnailClick = (imagePath) => {
    setModalImage(imagePath);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCharacterToggle = (character) => {
    setSelectedCharacters((prevSelected) =>
      prevSelected.includes(character)
        ? prevSelected.filter((name) => name !== character)
        : [...prevSelected, character]
    );
  };

  const handleGroupToggle = (group) => {
    const groupCharacters = characterGroups[group];
    const allSelected = groupCharacters.every((character) =>
      selectedCharacters.includes(character)
    );
    setSelectedCharacters((prevSelected) =>
      allSelected
        ? prevSelected.filter((name) => !groupCharacters.includes(name))
        : [...prevSelected, ...groupCharacters.filter((name) => !prevSelected.includes(name))]
    );
  };

  const filteredThemes = selectedCharacters.length
    ? Array.from(
        new Set(
          images
            .filter((image) => selectedCharacters.includes(image.character))
            .map((image) => image.theme)
        )
      )
    : themeNames;

  const filteredImages = images.filter((image) => {
    const characterMatch =
      selectedCharacters.length === 0 || selectedCharacters.includes(image.character);
    const themeMatch = selectedTheme === '전체' || image.theme === selectedTheme;
    const unassignedMatch = showUnassignedOnly
      ? image.character === '미지정' || image.theme === '미지정'
      : true;
    return characterMatch && themeMatch && unassignedMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  const getPageNumbers = () => {
    const maxPagesToShow = 10;
    const halfMax = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(currentPage - halfMax, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      pageNumbers.push('...', totalPages);
    }

    return pageNumbers;
  };

  const [inputPage, setInputPage] = useState('');

  const handlePageInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      alert(`1부터 ${totalPages} 사이의 유효한 페이지 번호를 입력하세요.`);
    }
    setInputPage('');
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCharacters, selectedTheme, showUnassignedOnly, itemsPerPage]);

  return (
    <div>
      {/* 캐릭터 체크박스 필터 */}
      <div style={{ marginBottom: '10px' }}>
        <h3>캐릭터 필터</h3>
        {Object.keys(characterGroups).map((group) => (
          <div key={group}>
            <label>
              <input
                type="checkbox"
                checked={characterGroups[group].every((char) =>
                  selectedCharacters.includes(char)
                )}
                onChange={() => handleGroupToggle(group)}
              />
              {group} 전체 선택
            </label>
            <div style={{ marginLeft: '20px' }}>
              {characterGroups[group].map((character) => (
                <label key={character} style={{ marginRight: '10px' }}>
                  <input
                    type="checkbox"
                    checked={selectedCharacters.includes(character)}
                    onChange={() => handleCharacterToggle(character)}
                  />
                  {character}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 테마 필터 */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          테마:
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            style={{ marginLeft: '5px' }}
          >
            <option value="전체">전체</option>
            {filteredThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>
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
          {currentImages.map((image) => (
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
                  style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                  onClick={() => handleThumbnailClick(image.imagePath)}
                />
              </td>
              <td>{image.character}</td>
              <td>{image.theme}</td>
              <td>
                <button>편집</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          style={{ marginRight: '5px' }}
        >
          처음
        </button>
        {getPageNumbers().map((number, index) =>
          typeof number === 'number' ? (
            <button
              key={index}
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
          ) : (
            <span key={index} style={{ margin: '0 5px' }}>
              {number}
            </span>
          )
        )}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          style={{ marginLeft: '5px' }}
        >
          끝
        </button>
        <div style={{ marginTop: '10px' }}>
          <input
            type="number"
            value={inputPage}
            onChange={handlePageInputChange}
            placeholder="페이지 번호"
            style={{ width: '80px', textAlign: 'center', marginRight: '5px' }}
          />
          <button onClick={handlePageInputSubmit}>이동</button>
        </div>
      </div>

      {/* 이미지 팝업 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            inset: '5%',
            padding: 0,
            border: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '5px 10px',
              cursor: 'pointer',
              zIndex: 1000,
            }}
          >
            닫기
          </button>
          {/* 원본 이미지 */}
          <img
            src={encodeURI(`${process.env.PUBLIC_URL}/${modalImage}`)}
            alt="원본 이미지"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              margin: 'auto',
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ImageTable;
