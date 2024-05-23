import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import icon from '../../wdam.png'
import {
    Wrapper,
    Container,
    Container2,
    StyledButtonContainer,
    InputsContainer
} from '../style/StyleComponent';



function MainPage(props) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(''); // 아이디
    const [password, setPassword] = useState(''); // 비밀번호
    const [pwVb, setPwVb] = useState(false); // 비밀번호 암호화 on/off

    useEffect(() => {
        const IdCheck = localStorage.getItem('headerData'); // accessToken 전역변수로 저장
        if (IdCheck) {
            //navigate('/fileupload');
        }

    },[navigate]) // navigate 작동 시

    const login = async() => {
        try {
            const response = await fetch('http://ec2-3-36-242-36.ap-northeast-2.compute.amazonaws.com:8080/users/login', { // 로그인 api
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // json 형태로 request parameter 전달
                },
                body: JSON.stringify({
                    userName: userId, // 아이디
                    password: password // 비밀번호
                })
            });
            
            const responseData = await response.json(); // response json 형태로 받기

            // 서버 응답에 따른 처리
            if (response.ok && responseData.code === "1000") {
                // 바디와 Authorization 저장                
                const headerData = response.headers.get('Authorization');
                const accessToken = responseData.data.accessToken;
                const refreshToken = responseData.data.refreshToken;
                
                // 로컬 스토리지 (전역 변수)에 저장
                localStorage.setItem('headerData', JSON.stringify(headerData));
                localStorage.setItem('accessToken', JSON.stringify(accessToken));
                localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

                navigate('/fileupload'); // 파일 업로드 페이지로 이동
            } else {
                // 로그인 실패
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