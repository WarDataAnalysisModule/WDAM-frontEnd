import React, {useState} from 'react';
import styled from 'styled-components';
import PostListItem from './PostListItem';

const ITEMS_PER_PAGE = 5;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

function PostList(props) {
    const { posts, onClickItem } = props;
    const [currentPage, setCurrentPage] = useState(0);

    // 현재 페이지에 따라 보여질 포스트들의 인덱스를 계산합니다.
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const selectedPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    // JavaScript에서 slice 메소드는 배열의 일부분을 선택하여 새로운 배열로 반환하는 기능을 합니다. 
    // slice는 원본 배열을 수정하지 않고,
    // 시작 인덱스부터 종료 인덱스 바로 앞까지의 요소를 포함하는 새로운 배열을 생성합니다.

    const pageCount = Math.ceil(posts.length / ITEMS_PER_PAGE);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 0; i < pageCount; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    disabled={currentPage === i}
                    style={{ backgroundColor: currentPage === i ? 'light gray' : 'white' }}
                >
                    {i + 1}
                </button>
            );
        }
        return pageNumbers;
    };

    // 다음 페이지로 이동하는 함수
    const handleNext = () => {
        setCurrentPage((prevPage) =>
            prevPage < Math.ceil(posts.length / ITEMS_PER_PAGE) - 1 ? prevPage + 1 : prevPage
        );
    };

    // 이전 페이지로 이동하는 함수
    const handlePrev = () => {
        setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
    };

    const handleFirst = () => {
        setCurrentPage(0);
    }

    const handleLast = () => {
        setCurrentPage(pageCount - 1);
    }
    return (
        <>
            <Wrapper>
                {selectedPosts.map((post, index) => (
                    <PostListItem
                        key={post.id}
                        post={post}
                        onClick={() => onClickItem(post)}
                    />
                ))}
            </Wrapper>
            <div>
                <button onClick={handleFirst}>
                    «
                </button>
                <button onClick={handlePrev}>
                    ‹
                </button>
                {renderPageNumbers()} {/* 페이지 번호 버튼을 렌더링합니다. */}
                <button
                    onClick={handleNext}
                    
                >
                    ›
                </button>
                <button
                    onClick={handleLast}
                    
                >
                    »
                </button>
            </div>
        </>
    );
}

export default PostList;