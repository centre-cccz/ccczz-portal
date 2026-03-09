import React from 'react';

export default function FileInput(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input type="file" {...props} className="input-file" />;
}
