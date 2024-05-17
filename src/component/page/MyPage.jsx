import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;

`


function MyPage(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPwd, setVerifyPwd] = useState('');
    const [username, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const passwordCheck = password === verifyPwd;
    const [pwVb, setPwVb] = useState(false);
    const headerData = JSON.parse(localStorage.getItem('headerData'));

    useEffect(() => {
        if (!localStorage.getItem('headerData')) navigate('/');
        check();
    }, [navigate])


    const check = async() => {
        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': headerData
                }
            });
            console.log(response);
            const responseData = await response.json();
            
            // 서버 응답에 따른 처리
            if (response.ok && responseData.code === "1000") {
                setName(responseData.data.userName);
                setPhoneNumber(responseData.data.phone);
                setEmail(responseData.data.email);
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
            if (password) updatedInfo.password = password;
            else updatedInfo.password = null;
            updatedInfo.userName = username;
            updatedInfo.phone = phoneNumber;
            updatedInfo.email = email;
            
            console.log(updatedInfo);

            const response = await fetch(`http://localhost:8080/users/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': headerData
                },
                body: JSON.stringify(updatedInfo)
            });
            console.log(response);
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

            const response = await fetch('http://localhost:8080/users/logout', {
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
            console.log(response);
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
                    onChange={(event) => {  // 여기를 camelCase로 변경
                        setName(event.target.value);
                    }}
                    placeHolder={localStorage.getItem('userId')}
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