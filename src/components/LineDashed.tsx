import React from 'react'
import {View} from 'react-native'
import DashedLine from 'react-native-dashed-line';
import { lineColor } from '../styles/colors';

export default function LineDashed() {
  return (
    
            <DashedLine
              dashLength={5}
              dashThickness={1}
              dashGap={5}
              dashColor={lineColor}
            />
         
  )
}
