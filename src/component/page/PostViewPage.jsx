import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CommentList from '../list/CommentList';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import data from '../../data.json';

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

const PostContainer = styled.div`
    padding: 8px 16px;
    border: 1px solid grey;
    border-radius: 8px;
`;

const TitleText = styled.p`
    font-size: 28px;
    font-weight: 500;
`;

const ContentText = styled.p`
    font-size: 20px;
    line-height: 32px;
    white-space: pre-wrap;
`;

const CommentLabel = styled.p`
    font-size: 16px;
    font-weight: 500;
`;

const StyledButton = styled.button`
    margin-top : 16px;
`
const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row; // 버튼을 가로로 나열
    gap: 8px; // 버튼 사이의 간격
    margin-top: 16px; // 위 요소와 버튼 사이의 간격
`;

function PostViewPage(props) {
    const navigate = useNavigate();
    const { postId } = useParams();

    const post = data.find((item) => {
        return item.id == postId;
    });

    const [comment, setComment] = useState('');

    return (
        <Wrapper>
            <Container>
                <Button
                    title='뒤로 가기'
                    onClick={() => {
                        navigate('/');
                    }}
                />
                <PostContainer>
                    <TitleText>{post.title}</TitleText>
                    <ContentText>{post.content}</ContentText>
                </PostContainer>

                <CommentLabel>댓글</CommentLabel>
                <CommentList comments={post.comments} />

                <TextInput
                    height={40}
                    value={comment}
                    onChange={(event) => {
                        setComment(event.target.value);
                    }}
                    placeHolder="댓글을 입력해주세요."
                />
                <Button
                    title='댓글 작성하기'
                    onClick={() => {
                        navigate('/');
                    }}
                />
                <ButtonContainer>
                <Button
                    title='글 삭제'
                    onClick={async () => {
                        try {
                            // 예시 API 호출
                            const response = await fetch(`https://your-api/posts/${postId}`, {
                                method: 'DELETE'
                            });
                
                            if (response.ok) {
                                // 서버에서 글 삭제가 성공했다면,
                                // UI 반영을 위해 상태 업데이트 또는 페이지 리디렉션
                                navigate('/');
                            } else {
                                // 에러 처리
                                console.error('Failed to delete the post.');
                            }
                        } catch (error) {
                            // 네트워크 에러 처리
                            console.error('An error occurred:', error);
                        }
                    }}
                />
                </ButtonContainer>
            </Container>
        </Wrapper>
    );
}

export default PostViewPage;