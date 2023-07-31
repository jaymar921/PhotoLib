import React from 'react'
import '../App.css'

function Button(props) {
    const { style, onClick } = props;
    
  return (
    <button onClick={(e)=>{onClick(e)}} className={`btn-generic ${style}`}>{props.children}</button>
  )
}

export default Button