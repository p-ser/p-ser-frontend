import { useEffect, useState } from 'react';

import axios from 'axios';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import './Register.css';
import SocialLogin from './SocialLogin';
import Timer from './Timer';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [isOpen, setIsOpen] = useState(false); // 이용약관에서 +, - 버튼 초기값을 false로 설정
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [isEmailCodeSend, setIsEmailCodeSend] = useState(false);
  const [isEmailAuthentication, setIsEmailAuthentication] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(isOpen => !isOpen); // on, off
  };

  const [allChecked, setAllChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });

  const handleAllChecked = event => {
    const isChecked = event.target.checked;
    setAllChecked(isChecked);
    setCheckboxes({
      checkbox1: isChecked,
      checkbox2: isChecked,
      checkbox3: isChecked,
    });
  };

  const handleSingleCheck = event => {
    const { name, checked } = event.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
    });
  };

  const handleSubmit = () => {
    const apiUrl = `${import.meta.env.VITE_PROD_API_SERVER}/member/signup`;

    axios
      .post(apiUrl, {
        username,
        email,
        password,
        emailCode,
      })
      .then(res => {
        if (res.status == 200) {
          alert('회원가입 성공');
          navigate('/');
        }
        if (res.status == 403 || res.status == 500) {
          // 이메일 인증이 되지 않은 경우 or 중복된 이메일
          alert('중복된 이메일입니다.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const submitCheck = () => {
    if (
      username != '' &&
      isEmailAuthentication == true &&
      password != '' &&
      passwordConfirm != '' &&
      password == passwordConfirm &&
      checkboxes.checkbox1 == true
    ) {
      return false;
    }
    return true;
  };

  const sendEmail = () => {
    const emailRegex = /^[A-Za-z0-9]+@[A-Za-z]+\.[A-Za-z]+$/;
    if (email == '') {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('이메일 형식을 확인해주세요.');
      return;
    }
    const apiUrl = `${import.meta.env.VITE_PROD_API_SERVER}/member/send-mail`;

    axios
      .post(apiUrl, {
        email,
      })
      .then(res => {
        if (res.status == 200) {
          // 200일 때, body 값 내용 없음
          setIsEmailSend(true);
          console.log('인증 번호 보내기 성공');
        }
        if (res.status == 400) {
          alert('이메일 형식을 확인해주세요.');
        }
        if (res.status == 500) {
          alert('중복된 이메일입니다.');
        }
      })
      .catch(error => {
        alert('중복된 이메일입니다.');
        console.log(error);
      });
  };

  const handleEmailCode = () => {
    if (emailCode == '') {
      alert('인증 번호를 입력해주세요.');
      return;
    }

    // 이메일 인증 API 호출 구현 예정
    const apiUrl = `${import.meta.env.VITE_PROD_API_SERVER}/member/confirm-mail`;

    axios
      .post(apiUrl, {
        email,
        emailCode,
      })
      .then(res => {
        if (res.data.body == true) {
          setIsEmailAuthentication(true);
          setIsEmailCodeSend(true);
          console.log('이메일 인증 성공');
        } else {
          setEmail('');
          setEmailCode('');
          setIsEmailSend(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const allAreChecked = Object.values(checkboxes).every(Boolean);
    setAllChecked(allAreChecked);
  }, [checkboxes]);

  return (
    <div className='register-container flex flex-col'>
      <div className='register-form flex flex-col'>
        <div className='name-box'>
          <h1>이름</h1>
          <input
            type='text'
            placeholder='이름을 입력해주세요.'
            onChange={e => setUsername(e.target.value)}
          />
          {username == '' ? (
            <p className='pt-2 text-red-800'>이름은 필수 입력 사항입니다.</p>
          ) : (
            <p></p>
          )}
        </div>
        <div className='email-box'>
          <h1>이메일</h1>
          <div className='mb-2 flex'>
            <input
              type='email'
              value={email}
              placeholder='이메일을 입력해주세요.'
              readOnly={isEmailAuthentication}
              onChange={e => setEmail(e.target.value)}
            />
            <button className={`email-send ${isEmailSend ? 'disabled' : ''}`}>
              <span
                className='p-2 text-white'
                disabled={isEmailSend}
                onClick={() => sendEmail()}
              >
                {isEmailAuthentication ? '인증 완료' : '이메일 인증'}
              </span>
            </button>
          </div>
          {isEmailSend ? (
            <div className='flex'>
              <input
                type='text'
                placeholder='인증 번호를 입력해주세요.'
                readOnly={isEmailAuthentication}
                onChange={e => setEmailCode(e.target.value)}
              />
              <Timer count={5} className='flex items-center px-4'></Timer>
              <button
                className={`email-validation ${isEmailCodeSend ? 'disabled' : ''}`}
                onClick={handleEmailCode}
              >
                <span className='p-2 text-white'>확인</span>
              </button>
            </div>
          ) : (
            ''
          )}

          {email == '' ? (
            <p className='pt-2 text-red-800'>이메일은 필수 입력 사항입니다.</p>
          ) : (
            <p></p>
          )}
        </div>
        <div className='pw-box'>
          <h1>비밀번호</h1>
          <input
            type='password'
            placeholder='영문자, 숫자, 특수문자 포함 8~20자'
            onChange={e => setPassword(e.target.value)}
          />
          {password == '' ? (
            <p className='pt-2 text-red-800'>
              비밀번호는 필수 입력 사항입니다.
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className='pwCheck-box'>
          <h1>비밀번호 확인</h1>
          <input
            type='password'
            placeholder='비밀번호를 확인해주세요.'
            onChange={e => setPasswordConfirm(e.target.value)}
          />
          {passwordConfirm == '' ? (
            <p className='pt-2 text-red-800'>
              비밀번호 확인은 필수 입력 사항입니다.
            </p>
          ) : password != passwordConfirm ? (
            <p className='text-red-800'>비밀번호가 일치하지 않습니다.</p>
          ) : (
            <p></p>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <p className='flex items-center justify-center gap-3'>
          <input
            type='checkbox'
            style={{ scale: '1.5' }}
            checked={allChecked}
            onChange={handleAllChecked}
          />
          <span>전체 동의</span>
        </p>
        <span className='cursor-pointer' onClick={toggleMenu}>
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
      </div>
      {isOpen && (
        <div className='detail-terms'>
          <p className='flex items-center gap-3'>
            <input
              type='checkbox'
              style={{ scale: '1.5' }}
              name='checkbox1'
              checked={checkboxes.checkbox1}
              onChange={handleSingleCheck}
            />
            <span>[필수] 이용 약관 동의</span>
          </p>
          <p className='flex items-center gap-3'>
            <input
              type='checkbox'
              style={{ scale: '1.5' }}
              name='checkbox2'
              checked={checkboxes.checkbox2}
              onChange={handleSingleCheck}
            />
            <span>[선택] 개인 정보 수집 및 이용 동의</span>
          </p>
          <p className='flex items-center gap-3'>
            <input
              type='checkbox'
              style={{ scale: '1.5' }}
              name='checkbox3'
              checked={checkboxes.checkbox3}
              onChange={handleSingleCheck}
            />
            <span>[선택] 마케팅 활용 동의 및 광고 수신 동의</span>
          </p>
        </div>
      )}

      <button
        className={`register-btn ${submitCheck() ? 'disabled' : ''}`}
        disabled={submitCheck()}
        onClick={handleSubmit}
      >
        회원가입
      </button>

      <div>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
