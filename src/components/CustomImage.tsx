import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {SvgUri} from 'react-native-svg';

interface CustomImageProps {
  uri: string;
  style?: any;
  // type: string;
  height?: number;
  width?: number;
  local?:boolean
}

export default function CustomImage({
  uri,
  style,
  // type,
  height,
  width,
  local
}: CustomImageProps) {
  const [extension, setExtension] = useState<string | undefined>(undefined);

  useEffect(() => {
    if(uri!==undefined){
      let ext = uri.split(/[#?]/)[0].split('.').pop().trim();
      setExtension(ext.toLowerCase());
    }
  }, [uri]);
  return (
    <>
    {extension==='webp' ||extension=== 'jpg' || extension=== 'png' || extension=== 'gif' ||  extension=== 'jpeg' || extension === 'tif'? (
        <Image style={style} source={{uri: uri}} />
      ) :
       (
        extension==='svg' ? <SvgUri 
        style={style}
        height= {height} 
        width={width} 
        uri={uri}
        // uri={"https://media.ipassio.com/media/lookup/catagory/hindustani-vocals/cover_picture/hindustani-vocal-01.svg"}
         />: null
      )  }
    </>
  );
}
