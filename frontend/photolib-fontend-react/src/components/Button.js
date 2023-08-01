import React, { useState } from 'react'
import '../App.css'

function Button(props) {
    const { styles, onClick } = props;
    
  return (
    <button onClick={(e)=>{onClick(e)}} className={`btn-generic ${styles}`}>{props.children}</button>
  )
}

export function Radio(props) {
  const [check, setCheck] = useState(false);
  const {getValue} = props;

  
  return (
    <div className='radio'>
      <div>
        <label>
          <input type="checkbox" className="toggle-checkbox" value={check} onClick={() => {setCheck(!check);getValue(!check)}}/>
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