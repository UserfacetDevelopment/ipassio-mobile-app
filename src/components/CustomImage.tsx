import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {SvgUri} from 'react-native-svg';

interface CustomImageProps {
  uri: string;
  style?: any;
  // type: string;
  height?: string;
  width?: string;
}

export default function CustomImage({
  uri,
  style,
  // type,
  height,
  width,
}: CustomImageProps) {
  const [extension, setExtension] = useState<string | undefined>(undefined);

  useEffect(() => {
    if(uri!==undefined){
      let ext = uri.split(/[#?]/)[0].split('.').pop().trim();
      setExtension(ext.toLowerCase());
      console.log(extension);
    }
  }, [uri]);
// console.log(uri)
  return (
    <>
    {extension==='webp' ||extension=== 'jpg' || extension=== 'png' ? (
        <Image style={style} source={{uri: uri}} />
      ) :
      (
        <SvgUri 
        // height='10%'
        // {height} 
        // width='40'
        // {width} 
        uri={uri} />
      ) }
    </>
  );
}
