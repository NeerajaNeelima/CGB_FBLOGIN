import React, { useState, useEffect } from 'react';

const FlashMessage = ({ message,showMessage,setShowMessage }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (showMessage) {
      timer = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress < 100) {
            return prevProgress + 5; // Increase progress by 10% every interval
          } else {
            clearInterval(timer); // Clear the interval when progress reaches 100%
            setTimeout(() => {
              setShowMessage(false); // Hide the message after a delay
              setProgress(0);
            }, 1000);
            return prevProgress;
          }
        });
      }, 100); // Interval duration in milliseconds
    }
    
    return () => clearInterval(timer); // Cleanup the interval on unmount or when showMessage becomes false
  }, [showMessage]);

  return (
    <div className='fixed left-[25%] top-[10%] bg-white z-10 drop-shadow-md'
    style={{width:'fit-content',maxWidth:"220px"}}
    >
      {showMessage && (
        <div>
          <p className='px-3 py-2'>{message}</p>
          <div className='w-100 bg-white'>
            <div className='bg-gradient h-[5px]'
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashMessage;
