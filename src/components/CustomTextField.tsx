import React from 'react'
import { TextInput } from 'react-native-paper'
import { font2, secondaryColor } from '../styles/colors'
import StyleCSS from '../styles/style';

interface TextInputProps {
    mode : string,
    label: string,
    style?:any;
    onChangeText: any;
    secureTextEntry ?: any;
    onFocus?:() => void;
    onBlur?:() => void;
    value?:any;
    editable?:boolean;
    returnKeyType?:any;
    autoCapitalize?:any;
    autoCorrect?:boolean;
    selectTextOnFocus?:boolean;
    keyboardType?: any;
    multiline?: boolean;
    onSubmitEditing ?: any;


}

const TextField = ({ onSubmitEditing , keyboardType, multiline, label, onFocus, onBlur, mode, style, selectTextOnFocus, onChangeText, secureTextEntry,value,autoCorrect, editable, autoCapitalize, returnKeyType} : TextInputProps) => {

    return(
        <TextInput
        label={label}
        mode={mode}
        value={value}
        // underlineColor='transparent'
        onFocus={onFocus}
        onBlur={onBlur}
        
        theme = {{colors: {primary: secondaryColor}}}
        style={[StyleCSS.styles.input, style]}
        onChangeText= {onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        autoCorrect={autoCorrect}
        selectTextOnFocus={selectTextOnFocus}
        keyboardType={keyboardType}
        multiline={multiline}
        onSubmitEditing={onSubmitEditing}
        ></TextInput>
    )

}

export default TextField