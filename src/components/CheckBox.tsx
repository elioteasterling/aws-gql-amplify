import React, {useState} from 'react';

const CheckBox = (props: any) => {
  const [isChecked, setIsChecked] = useState(false);

  const onChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {isChecked ? props.labelOn : props.labelOff}
    </label>
  );
};

export default CheckBox;