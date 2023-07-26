import React from 'react'
import '../Components.css';

function ViewsComponent({views = 0}) {
  return (
    <div className='ViewCounter'><i className="fa-solid fa-eye"></i> {views}</div>
  )
}

export default ViewsComponent