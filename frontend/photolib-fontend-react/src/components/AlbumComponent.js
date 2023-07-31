import React, { useEffect, useState } from 'react'
import ViewsComponent from './ViewsComponent';
import { GetMonthYear } from '../Utils/DataHelper';
import Button from './Button';

function AlbumComponent({albums, callback, addAlbumCallback}) {


  return (
    <div className='Album-Container'>
        <h1 className='Title'>Albums</h1>
        <div className='Albums-List'>
            
            {
                albums.map(album => {
                    return <Album key={album.guid} data={album} callback={callback}/>
                })
            }
            
        </div>
        <Button style={'top-Right'} onClick={addAlbumCallback}>
            New Album
        </Button>
    </div>
  )
}

function Album({data, callback}){
    
    return (
        <div className='Album' onClick={(e)=> {callback(data.title)}}>
            <div className='darkbg'></div>
            <div className='Image-Container'>
                <img src='./assets/IMG_2967.JPG' />
            </div>
            <div className='info'>
                <h2>{data.title}</h2>
                <p>{GetMonthYear(data.albumState.dateCreated).join(" ")}</p>
                <ViewsComponent views={data.albumState.views} />
            </div>
        </div>
    )
}

export default AlbumComponent