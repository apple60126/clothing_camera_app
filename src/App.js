import './App.css';
import './CameraContainer.css';
import ImageGallery from './ImageGallery';

import React, {useRef, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [imgSrcList, setImgSrcList] = useState([]);
  const [startedCapturing, setStartedCapturing] = useState(false);
  const [isPortraitMode, setIsPortraitMode] = useState(false);
  const cameraStream = useRef(null);

  const [oAlpha, setOAlpha] = useState(0.0);
  const [oBeta, setOBeta] = useState(0.0);
  const [oGamma, setOGamma] = useState(0.0);
  
  const [agx, setAgx] = useState(0.0);
  const [agy, setAgy] = useState(0.0);
  const [agz, setAgz] = useState(0.0);

  const [ax, setAx] = useState(0.0);
  const [ay, setAy] = useState(0.0);
  const [az, setAz] = useState(0.0);

  const [gx, setGx] = useState(0.0);
  const [gy, setGy] = useState(0.0);
  const [gz, setGz] = useState(0.0);

  async function takeHighResolutionPhoto() {
      // Create a canvas to capture a frame from the video
      const canvas = document.createElement('canvas');
      const video = document.querySelector('video');
      canvas.width = video.videoWidth; // Set canvas size to video stream size for highest resolution
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the current video frame to the canvas
  
      // Convert the canvas to a data URL (base64 encoded image)
      const photoDataUrl = canvas.toDataURL('image/jpeg');

      if (oGamma > 1.5 || oGamma < -1.5 || oBeta > 1.5 || oBeta < -1.5) {
        toast.error("Your phone must level to take the picture. The bars should be green!", {position: "bottom-center"});
      } else {
        // save the photo URL to the list
        setImgSrcList(imgSrcList => [...imgSrcList, photoDataUrl] );
      }
  }

  function handleOrientation(event) {
    setOAlpha(event.alpha);
    setOBeta(event.beta);
    setOGamma(event.gamma);
    updateLevelIndicator(event.gamma, "y");
    updateLevelIndicator(event.beta, "x");
  }

  function handleMotion(event) {
    setAgx(event.accelerationIncludingGravity.x);
    setAgy(event.accelerationIncludingGravity.y);
    setAgz(event.accelerationIncludingGravity.z);
  
    setAx(event.acceleration.x);
    setAy(event.acceleration.y);
    setAz(event.acceleration.z);
    
    setGz(event.rotationRate.alpha);
    setGx(event.rotationRate.beta);
    setGy(event.rotationRate.gamma);
  }

  function updateLevelIndicator(level, levelAxis) {
    // Min of -10, max of 10 for position calculation
    level = level < 0 ? Math.max(-10, level) : Math.min(10, level);

    let levelContainer;
    let levelBar;
    let indicator;
    if (levelAxis == "y") {
      levelContainer = document.querySelector('.y-level-container');
      levelBar = document.querySelector('.y-level-bar');
      indicator = document.querySelector('.y-indicator');  
    } else {
      levelContainer = document.querySelector('.x-level-container');
      levelBar = document.querySelector('.x-level-bar');
      indicator = document.querySelector('.x-indicator');  
    }

    if (!levelBar || !indicator) return;
  
    let color = '#ddd'; // Default color
    let positionPercentage = 0; // Default position percentage

    if (level < -10) {
      color = 'rgb(240, 0, 0)'; // Vibrant Red
      positionPercentage = 0;
    } else if (level > 10) {
      color = 'rgb(240, 0, 0)'; // Vibrant Red
      positionPercentage = 100;
    } else if (level < -1.5) {
      // Transition area: Red to light red as it approaches the center
      let interpolationFactor;
      interpolationFactor = (-1.5 - level) / (-10 + 1.5);
      const greenBlueValue = 209 * interpolationFactor;
      color = `rgb(240, ${Math.round(greenBlueValue)}, ${Math.round(greenBlueValue)})`;
      positionPercentage = ((level + 10) / 8.5) * 50;
    } else if (level > 1.5) {
        // Transition area: Red to light red as it approaches the center
      let interpolationFactor;
      interpolationFactor = 1 - (level - 1.5) / (10 - 1.5);
      const greenBlueValue = 209 * interpolationFactor;
      color = `rgb(240, ${Math.round(greenBlueValue)}, ${Math.round(greenBlueValue)})`;
      positionPercentage = 50 + ((level - 1.5) / 8.5) * 50;
    } else if (level <= 1.5 && level >= -1.5) {
        // Full Green for "good" values
        color = 'hsl(140, 100%, 50%)'; // Vibrant Green
        positionPercentage = 50;
      }

      levelBar.style.backgroundColor = color;
      
      // Fill in top-left corner with the color too (so it's not white)
      levelContainer.style.backgroundColor = color;


      if (levelAxis == "y") {
        indicator.style.left = `calc(${positionPercentage}% - 5px)`;
      } else {
        indicator.style.top = `calc(${positionPercentage}% - 15px)`;
      }
  }

  const requestMotionPermissions = async (e) => {
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    if((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
      window.addEventListener("devicemotion", handleMotion);
      window.addEventListener("deviceorientation", handleOrientation);  
    }

    const constraints = {
      video: {
        width: { ideal: 3840 }, height: { ideal: 2160 },
        facingMode: {
          ideal: "environment"
        }
      }
    };

    try {
      // Request the camera stream with the highest resolution available
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraStream.current = stream;

      // Create a video element to play the stream
      const video = document.querySelector('video');
      video.srcObject = cameraStream.current;
      await video.play();

      setStartedCapturing(true)      
    } catch (error) {
      console.error('Error requesting permissions', error);
      if (cameraStream.current) {
        cameraStream.current.getTracks().forEach(track => track.stop());
      }
      throw error;
    }
  }

  return (
    <div className="App">
      { window.innerWidth > window.innerHeight && (
        <p>Please rotate your phone to use portrait and refresh</p>
      )}

      { window.innerWidth <= window.innerHeight && ( 
      <>
      {/* Used for error toast if user tries taking an un-level photo */}
      <ToastContainer
          autoClose={5000}
          hideProgressBar={true}
      />

        {!startedCapturing && 
        (
        // Initial gradient "Start capturing" screen with button
        <div className="gradient-bg">
          <div className="button-container">
            <button className="start-button" onClick={(e) => requestMotionPermissions(e)}>Start capturing</button>
          </div>
        </div>
        )}

      <div className="main-content">
        {startedCapturing && 
          <div>
            {/* Level bar on the left of the screen show if "pitch" is correct */}
            <div className='y-level-container '>
              <div className='y-level-bar'>
                <div className='y-indicator'></div>
              </div>
            </div>

            {/* Level bar on the top of the screen show if "roll" is correct */}
            <div className='x-level-container'>
              <div className='x-level-bar'>
                <div className='x-indicator'></div>
              </div>
            </div>            
          </div>
        }

        <div className='camera-container'>
          {/* video shows the camera stream, and is used
           to capture the pixels to save the photo */}
          <video autoPlay muted={true} playsInline></video>
          {startedCapturing &&
            <div className="jeans-outline">
              <img src="/jeans.png" />
            </div>
          }
          {startedCapturing && 
            <div className='capture-button-container'>
              <div className='capture-button' onClick={() => takeHighResolutionPhoto()}>
                <div className='inner'></div>
              </div>
            </div>
          }
        </div>
        {startedCapturing &&
          <div>
            {/* Scrollable gallery of the photos the user has taken */}
            <ImageGallery imgSrcList={imgSrcList} setImgSrcList={setImgSrcList} />
          </div>
        }
        </div>
        </>
      )}
    </div>
  );
}

export default App;
