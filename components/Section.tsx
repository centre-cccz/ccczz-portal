import React from 'react';

export default function Section({children, title}:{children:React.ReactNode,title?:string}){
  return (
    <section className="container">
      {title && <h2>{title}</h2>}
      <div>{children}</div>
    </section>
  );
}
