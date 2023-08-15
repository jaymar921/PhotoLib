import React, { useEffect, useState } from 'react'
import '../App.css'
import '../Components.css'

function Button(props) {
    const { styles, onClick } = props;
    
  return (
    <button type='button' onClick={(e)=>{onClick(e)}} className={`btn-generic ${styles}`}>{props.children}</button>
  )
}

export function Radio(props) {
  const [check, setCheck] = useState(false);
  const {getValue, setValue} = props;

  useEffect(()=> {
    if(setValue === undefined)
      return;
    setCheck(setValue)
  }, [setValue, getValue, check])
  return (
    <div className='radio'>
      <div>
        <label>
          <input type="checkbox" className="toggle-checkbox" checked={check} onChange={(e)=> {setCheck(!check);getValue(!check)}}/>
          <div className="toggle-switch"></div>
        </label>
      </div>
      <div>
        <p>{props.children}</p>
      </div>
    </div>
  )
}

export default Button