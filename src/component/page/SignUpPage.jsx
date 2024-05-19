import React, {useState} from 'react';
import { useNavigate, Link, useRef } from 'react-router-dom';
import styled from 'styled-components';
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

function SignUpPage(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [username, setId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const passwordCheck = password === confirmPwd;
    const [pwVb, setPwVb] = useState(false);

    const handleSubmit = async() => {
        try {
            if (!passwordCheck) {
                alert("비밀번호를 확인해주세요.");
            }
            else if (password === '' || username === '' || email === '' || phoneNumber === '') {
                alert("정보를 정확하게 입력해주세요.")
            }
            else {
                const response = await fetch('http://localhost:8080/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        username: username,
                        phone: phoneNumber
                    })
                });
                console.log(response);

                const responseData = await response.json();

                // 서버 응답에 따른 처리
                if (response.ok && responseData.code === "1000") {
                    // 회원가입 성공
                    console.log('회원가입 성공:', responseData);
                    navigate('/');  // 회원가입 성공 후 리디렉션
                } else {
                    // 회원가입 실패
                    console.error('회원가입 실패:', responseData);
                    alert("아이디 또는 이메일이 중복되었습니다.");
                }
            }
        } catch (error) {
            console.error('서버 에러:', error);
        }
    }
    return (
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
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setId(event.target.value);
                    }}
                    placeHolder="아이디"  // 여기를 소문자로 변경
                    icon='ID'
                />
                <TextInput 
                    height={60}
                    value={password}
                    type={pwVb ? "text" : "password"}
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setPassword(event.target.value);
                    }}
                    placeHolder="비밀번호"  // 여기를 소문자로 변경
                    icon='password'
                />
                <TextInput 
                    height={60}
                    value={confirmPwd}
                    type={"password"}
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setConfirmPwd(event.target.value);
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
                    title='회원가입'
                    onClick={handleSubmit}
                />
                </StyledButtonContainer>
            </Container>
        </Wrapper>
    );
}

export default SignUpPage;