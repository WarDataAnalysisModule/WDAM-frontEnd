import React, {useState} from 'react';
import { useNavigate, Link, useRef } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button';
import data from '../../data.json';
import TextInput from '../ui/TextInput';
import icon from '../../wdam.png'


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
    
    //box-shadow: 0 4px 8px rgba(0,0,0,0.1); // 그림자 추가
    padding: 24px;
    border-radius: 8px; // 테두리 둥글게
    //background-color: #fff; // 배경색 변경
    margin-bottom: 24px; // 마진 변경
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

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`;


const StyledButtonContainer = styled.div`
  display: flex; // Flexbox 레이아웃 사용
  justify-content: center; // 자식 요소들을 수평 중앙으로 정렬
  gap: 16px; // 버튼 사이에 간격 추가
  margin-top: 20px; // 상단 여백 추가
  min-width: 120px;
  margin-bottom: -20px;
  padding: 10px 20px;
`;

function SignUpPage(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setName] = useState('');
    const [username, setId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const passwordCheck = password === nickname;
    const [pwVb, setPwVb] = useState(false);

    const requestAuthCode = async() => {
        try {
            const response = await fetch('http://13.125.129.92:8080/authnum/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                // 회원가입 성공
                console.log('회원가입 성공:', data);
                navigate('/');  // 회원가입 성공 후 리디렉션
            } else {
                // 회원가입 실패
                console.error('회원가입 실패:', data);
            }
        } catch (error) {
            console.error('서버 에러:', error);
        }
    }
    // 병준이 db 주소 : http://13.125.129.92:8080/user/signup
    const handleSubmit = async() => {
        try {
            if (!passwordCheck) {
                alert("비밀번호를 확인해주세요.");
            }
            else if (password === '' || username === '' || email === '' || phoneNumber === '') {
                alert("정보를 정확하게 입력해주세요.")
            }
            else {
                const response = await fetch('http://localhost:8080/api/user', {
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

                const data = await response.json();

                // 서버 응답에 따른 처리
                if (response.ok) {
                    // 회원가입 성공
                    console.log('회원가입 성공:', data);
                    navigate('/');  // 회원가입 성공 후 리디렉션
                } else {
                    // 회원가입 실패
                    console.error('회원가입 실패:', data);
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
                    value={nickname}
                    type={pwVb ? "text" : "password"}
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setName(event.target.value);
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
                <br></br>
                <StyledButtonContainer>
                <Button
                    type="disabled"
                    title='인증번호 요청'
                    onClick={requestAuthCode}
                />
                </StyledButtonContainer>
            </Container>
        </Wrapper>
    );
}

export default SignUpPage;