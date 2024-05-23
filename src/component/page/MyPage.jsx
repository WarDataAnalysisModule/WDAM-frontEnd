import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import icon from '../../wdam.png'
import {
    Wrapper,
    Container,
    Container2,
    StyledButtonContainer,
    InputsContainer,
    ButtonContainer
} from '../style/StyleComponent';



function MyPage(props) {
    const navigate = useNavigate(); // 페이지 이동 때 사용
    const [email, setEmail] = useState(''); // 이메일
    const [password, setPassword] = useState(''); // 비밀번호
    const [verifyPwd, setVerifyPwd] = useState(''); // 비밀번호 확인
    const [username, setName] = useState(''); // 닉네임
    const [phoneNumber, setPhoneNumber] = useState(''); // 전화번호
    const passwordCheck = password === verifyPwd; // 비밀번호 확인 시 체크하는 변수 (boolean)
    const [pwVb, setPwVb] = useState(false); // 비밀번호 암호화
    const headerData = JSON.parse(localStorage.getItem('headerData')); // 전역변수로 저장된 accessToken 불러옴

    useEffect(() => {
        if (!localStorage.getItem('headerData')) navigate('/');
        check();
    }, [navigate])


    const check = async() => {
        try {
            const response = await fetch('http://ec2-3-36-242-36.ap-northeast-2.compute.amazonaws.com:8080/users', { // 마이페이지 조회
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // json으로 전달
                    'Authorization': headerData // accessToken
                }
            });
            const responseData = await response.json(); // json으로 response 받기
            // 서버 응답에 따른 처리
            if (response.ok && responseData.code === "1000") { // 정상적인 연결
                setName(responseData.data.userName);
                setPhoneNumber(responseData.data.phone);
                setEmail(responseData.data.email); // 이름, 전화번호, 이메일 저장
            } else {
                // 데이터 가져오기 실패
                alert("GET 실패");
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
            alert("GET 실패");
        }
    }

    const handleSubmit = async() => {
        try {
            if (!passwordCheck) {
                alert("비밀번호를 확인해주세요.");
                return;
            }

            let updatedInfo = {};
            if (password) updatedInfo.password = password; // 비밀번호 수정될 시 
            else updatedInfo.password = null; // 안될 시
            updatedInfo.phone = phoneNumber;
            updatedInfo.email = email;

            const response = await fetch(`http://ec2-3-36-242-36.ap-northeast-2.compute.amazonaws.com:8080/users/update`, { // 유저 정보 업데이트
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': headerData
                },
                body: JSON.stringify(updatedInfo)
            });
            
            const responseData = await response.json();

            // 서버 응답에 따른 처리
            if (response.ok && responseData.code === "1000") {
                // 정보 수정 성공
                setPassword('');
                setVerifyPwd('');
                alert("정보 수정 성공");
            } else {
                // 정보 수정 실패
                alert("정보 수정 실패");
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
            alert("정보 수정 실패");
        }
    }

    const logout = async() => {
        try {
            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

            const response = await fetch('http://ec2-3-36-242-36.ap-northeast-2.compute.amazonaws.com:8080/users/logout', { // 로그아웃
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': headerData
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            });
            
            const responseData = await response.json();
            
            // 서버 응답에 따른 처리
            if (response.ok && responseData.code === "1000") {
                localStorage.setItem('headerData', '');
                localStorage.setItem('accessToken', '');
                localStorage.setItem('refreshToken', '');
                alert("로그아웃 되었습니다.");
                navigate('/');
            } else {
                // 로그아웃 실패
                alert("로그아웃 실패");
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
            alert("로그아웃 실패");
        }
    }

    return (
        <div>
            <ButtonContainer>
                <Button type="tag" title="로그아웃" onClick={logout}/>
            </ButtonContainer>
        <Wrapper>
            <Link to="/">
                <Container2>
                    <img src={icon} alt="img" style={{maxWidth: '300px', height: 'auto', pointerEvents: 'all'}}/>
                </Container2>
            </Link>
            <Container>
                <InputsContainer>
                <TextInput 
                    height={60}
                    value={username}
                    placeHolder="아이디"
                    disabled={true}  // 여기를 소문자로 변경
                    icon="ID"
                />
                <TextInput 
                    height={60}
                    value={password}
                    type={pwVb ? "text" : "password"}
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setPassword(event.target.value);
                    }}
                    placeHolder="비밀번호"  // 여기를 소문자로 변경
                    icon="password"
                />
                <TextInput 
                    height={60}
                    value={verifyPwd}
                    type={pwVb ? "text" : "password"}
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setVerifyPwd(event.target.value);
                    }}
                    placeHolder="비밀번호 확인"  // 여기를 소문자로 변경
                    icon="password"
                />
                <TextInput 
                    height={60}
                    value={phoneNumber}
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setPhoneNumber(event.target.value);
                    }}
                    placeHolder="전화번호"  // 여기를 소문자로 변경
                    icon="phone"
                />
                <TextInput 
                    height={60}
                    value={email}
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setEmail(event.target.value);
                    }}
                    placeHolder="이메일"  // 여기를 소문자로 변경
                    icon="email"
                />
                </InputsContainer>
                {!passwordCheck && (
                    <p style={{textAlign: 'center', color:'red'}}>비밀번호가 다릅니다.</p>
                )}
                {passwordCheck && (
                    <p style={{textAlign: 'center', color:'green'}}>비밀번호가 일치합니다.</p>
                )}
                <div style={{textAlign: 'center', color: 'black'}}>
                    비밀번호 보기
                    <input type="checkbox"
                    checked={pwVb}
                    onChange={e => setPwVb(e.target.checked)}>
                    </input>
                </div>
                <StyledButtonContainer>
                <Button
                    title='수정하기'
                    onClick={handleSubmit}
                />
                </StyledButtonContainer>
                <br></br>
            </Container>
        </Wrapper>
        </div>
    );
}

export default MyPage;