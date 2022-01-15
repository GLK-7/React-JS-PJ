import {ButtonHTMLAttributes} from 'react';

import '../styles/buttonLogout.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

export function ButtonLogout({isOutlined = false, ...props}: ButtonProps){
    return(
        <button 
        className={`buttonLogout ${isOutlined ? 'outlined' : ''}`} 
        {...props}
        />
    )
    
}
