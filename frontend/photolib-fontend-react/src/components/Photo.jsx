import React from 'react'
import '../Components.css'
import ViewsComponent from './ViewsComponent';

function Photo({src, text, onClick, metaData, setActive, setShowDisplay}) {
  return (
    <div className='Photo' onClick={(e)=>{
      if(onClick)
        onClick({
          metaData,
          imageSrc: src,
          event:e
        });
        setActive({metaData,
          imageSrc: src,
          event:e});
        setShowDisplay('');
    }}>
        <div className='Image-Container'>
            <img src={src} />    
            {text}
        </div>
    </div>
  )
}


export function DisplayPhoto({data, show, setShow}){
  const image = data;
  if(!image)
    return;

  console.log(image)
  return (
    <div id='show-image-modal' className={`photo-modal ${show}`} onClick={(e)=> {
      if(e.target.id === 'show-image-modal')
        setShow('hidden');
    }}>
      <div className='photo'>
        <div className='photo-container'>
          <img src={image.imageSrc}/>
        </div>
        <p className='caption'>{image.metaData.caption}<ViewsComponent views={image.metaData.views}/></p>
        
      </div>

    </div>
  )
}

export default Photo