import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import PostList from '../list/PostList';
import Button from '../ui/Button';
import data from '../../data.json';
import TextInput from '../ui/TextInput';
import {FaRegCheckCircle, FaMoneyCheck} from 'react-icons/fa';
import icon from '../../wdam.png'

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //background-color: #f7f7f7;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    :not(:last-child) {
        margin-bottom: 16px;
    }
    
    //box-shadow: 0 4px 8px rgba(0,0,0,0.1); // 그림자 추가
    padding: 24px;
    border-radius: 8px; // 테두리 둥글게
    //background-color: #fff; // 배경색 변경
    margin-bottom: 24px; // 마진 변경
`;

const StyledButtonContainer = styled.div`
  display: flex; // Flexbox 레이아웃 사용
  justify-content: center; // 자식 요소들을 수평 중앙으로 정렬
  gap: 16px; // 버튼 사이에 간격 추가
  margin-top: 20px; // 상단 여백 추가
  min-width: 120px;
  padding: 10px 20px;
`;

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const Container2 = styled.div`
    width: 100%;
    max-width: 720px;
    display: flex; // Flex 컨테이너로 만듭니다
    justify-content: center; // 수평 중앙 정렬
    align-items: center; // 수직 중앙 정렬
    //padding: 24px;
    border-radius: 8px;
    margin-top: 40px;
`;



function MainPage(props) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const idx = localStorage.getItem('Idx');
    const [pwVb, setPwVb] = useState(false);

    useEffect(() => {
        const IdCheck = localStorage.getItem('userId');
        if (IdCheck) {
            navigate('/fileupload');
        }

    },[navigate])

    const login = async() => {
        try {
            const response = await fetch('http://localhost:8080/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userId,
                    password: password
                })
            });
            console.log(response);
            const data = await response.json();

                // 서버 응답에 따른 처리
                if (response.ok) {
                    // 회원가입 성공
                    localStorage.setItem('Idx', data.id);
                    localStorage.setItem('userId', userId);
                    alert("로그인 되었습니다.");
                    navigate('/fileupload');
                } else {
                    // 회원가입 실패
                    alert("아이디 또는 비밀번호가 일치하지 않습니다.");
                }
        }
        catch (error) {
            console.error('서버 에러:', error);
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    return (
        <Wrapper>
            <Link to="/">
                <Container2>
                    <img src={icon} alt="img" style={{maxWidth: '300px', height: 'auto', pointerEvents: 'all'}}/>
                </Container2>
            </Link>
            <br></br>
            <Container>
                <InputsContainer>
                <TextInput height={60} value={userId} 
                onChange={(event)=> {
                    setUserId(event.target.value);
                }} placeHolder="아이디"
                icon="ID"/>
                <TextInput height={60} value={password}
                onChange={(event)=> {
                    setPassword(event.target.value);
                }} placeHolder="비밀번호"
                type={pwVb ? "text" : "password"}
                icon="password"/>
                </InputsContainer>
                <div style={{textAlign: 'center', color: 'black'}}>
                    비밀번호 보기
                    <input type="checkbox"
                    checked={pwVb}
                    onChange={e => setPwVb(e.target.checked)}>
                    </input>
                </div>
                <StyledButtonContainer>
                    <Button title="로그인" onClick={login}/>
                </StyledButtonContainer>
                    <Button type={"transparent"} title="회원가입" onClick={()=> {
                        navigate('/signup');
                    }}/>
                
            </Container>
        </Wrapper>
    );
}

export default MainPage;