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
            <img alt={src} src={src} />    
            {text}
        </div>
    </div>
  )
}


export function DisplayPhoto({data, show, setShow}){
  const image = data;
  if(!image)
    return;

  return (
    <div id='show-image-modal' className={`photo-modal ${show}`} onClick={(e)=> {
      if(e.target.id === 'show-image-modal')
        setShow('hidden');
    }}>
      <div className='photo'>
        <div className='photo-container'>
          <img alt={image.imageSrc} src={image.imageSrc}/>
        </div>
        <div className='caption'>{image.metaData.caption}<ViewsComponent views={image.metaData.views}/></div>
        
      </div>

    </div>
  )
}

export default Photo