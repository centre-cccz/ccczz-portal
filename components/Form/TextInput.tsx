import React from 'react';

export default function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input type="text" {...props} className="input-text" />;
}
