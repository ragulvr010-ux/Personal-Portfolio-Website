import React, { useEffect, useRef, useState } from 'react';

export default function LazyImage({ src, alt='', className='', style={}, placeholderColor='#e5e7eb' }){
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries=>{
        entries.forEach(e=> e.isIntersecting && setVisible(true));
      }, { rootMargin: '100px' });
      if (ref.current) io.observe(ref.current);
      return ()=> io.disconnect();
    }
    setVisible(true);
  },[]);

  return (
    <div ref={ref} className={`${className} relative`} style={{...style}}>
      {!loaded && <div aria-hidden className="absolute inset-0 animate-pulse" style={{background: placeholderColor}} />}
      {visible && (
        <img src={src} alt={alt} onLoad={()=>setLoaded(true)} style={{display: loaded ? 'block' : 'block'}} className={`w-full h-full object-cover`} />
      )}
    </div>
  );
}
