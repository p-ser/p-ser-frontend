/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaRegCalendar } from 'react-icons/fa6';

import './DateSelector.css';

function DateSelector({ onDateChange, initialRange }) {
  const [state, setState] = useState([
    {
      startDate: initialRange?.[0]?.startDate || new Date(),
      endDate: initialRange?.[0]?.endDate || addDays(new Date(), 1),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    if (initialRange) {
      setState(initialRange);
    }
  }, [initialRange]);

  function handleSelect(ranges) {
    const newRange = [ranges.selection];
    setState(newRange);
    if (onDateChange) {
      onDateChange(newRange);
    }
  }

  const [showPicker, setShowPicker] = useState(false);
  const buttonText = `${format(state[0].startDate, 'yyyy.MM.dd')} - ${format(state[0].endDate, 'yyyy.MM.dd')}`;
  const selectorRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowPicker(false); // 외부 클릭 감지 시 캘린더 닫기
      }
    }

    // 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // 빈 의존성 배열 사용하여 컴포넌트 마운트 시 1회만 실행

  return (
    <div className='relative' ref={selectorRef}>
      <button
        onClick={() => setShowPicker(!showPicker)}
        className='dateSelect-btn'
      >
        <FaRegCalendar />
        {buttonText}
      </button>

      {showPicker && (
        <DateRange
          className='date-range absolute z-10'
          onChange={handleSelect}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={state}
          direction='horizontal'
        />
      )}
    </div>
  );
}

export default DateSelector;
