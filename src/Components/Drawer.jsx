import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Rect, Layer, Circle, Text, Image } from "react-konva";

import useImage from "use-image";
import { useControls } from "leva";






const Drawer = () => {
  const konvaControls = useControls({
    textFontSize: { value: 40, min: 10, max: 300 },

  });










  // Image Input

  const [image, setImage] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const HandleImageInput = (e) => {
    const reader = new FileReader();
    let imageUrl;
    reader.onload = () => {
      if (reader.readyState === 2) {
        imageUrl = reader.result;
        setImage(imageUrl);

        const imageEl = document.createElement("img");
        imageEl.src = imageUrl;
        imageEl.onload = () => {
          const aspectRatio = imageEl.width / imageEl.height;
          const newImageWidth = 120 * aspectRatio;
          setImageWidth(newImageWidth);
          console.log(newImageWidth);
        };

        document.getElementById("my_modal_2").showModal();

      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  function NewImage(props) {
    const [url] = useImage(image);

    return (
      <Image
        {...props}
        image={url}
        draggable
        width={imageWidth }
        height={150}
      />
    );
  }








  // Text Input

  const [text, setText] = useState("");
  const textInput = useRef();
  const HandleSubmitText = (e) => {
    e.preventDefault();
    const text = textInput.current.value;
    setText(text);
    document.getElementById("my_modal_2").showModal();
    
  };

  function NewText(props) {
    return (
      <Text
        {...props}
        text={text}
        draggable
        fontSize={konvaControls.textFontSize}
      />
    );
  }

  // Change Color of the shirt

  const [currentColor, setCurrentColor] = useState("white");

  const HandleColorInput  = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
  };

  function svgToURL(s) {
    const uri = window.btoa(unescape(encodeURIComponent(s)));
    return "data:image/svg+xml;base64," + uri;
  }

  const svg = `
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
      width="499.000000pt" height="500.000000pt" viewBox="0 0 499.000000 500.000000"
      preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill="${currentColor}" stroke="none">
      <path d="M4146 4921 c-45 -89 -110 -153 -184 -182 -50 -20 -75 -23 -202 -23
      -128 -1 -152 2 -202 22 -70 28 -144 105 -179 186 -13 31 -29 56 -35 56 -6 0
      -38 -12 -70 -26 -33 -14 -107 -43 -166 -65 -137 -49 -320 -127 -335 -142 -8
      -9 -6 -41 12 -132 43 -218 62 -580 44 -856 -16 -261 -54 -371 -167 -488 l-74
      -76 6 -100 c3 -55 13 -203 21 -330 25 -400 30 -685 29 -1656 l0 -946 76 -7
      c101 -8 1878 -8 2045 0 72 4 137 10 146 15 12 6 16 20 14 51 -26 454 -26 2145
      0 2533 2 39 7 115 10 170 3 55 8 139 11 187 l7 88 -45 42 c-161 154 -202 299
      -212 748 -4 238 29 602 63 694 6 15 11 35 11 45 0 30 -80 68 -340 161 -58 20
      -136 51 -174 69 -38 17 -70 31 -72 31 -2 0 -19 -31 -38 -69z"/>
      <path d="M685 4819 c-99 -61 -223 -134 -275 -163 -110 -60 -107 -49 -72 -211
      32 -145 51 -317 58 -510 11 -283 -18 -444 -101 -570 -40 -59 -124 -126 -182
      -146 -29 -9 -34 -15 -29 -33 12 -42 45 -354 56 -536 24 -381 28 -646 23 -1440
      -6 -1059 -7 -1042 14 -1057 12 -9 49 -11 132 -8 469 21 631 25 985 25 221 0
      536 -7 701 -15 165 -8 330 -15 368 -15 l67 0 -2 963 c-1 529 1 1021 5 1092 4
      72 10 173 12 225 23 444 44 661 71 762 4 13 -10 24 -58 46 -142 65 -235 220
      -264 442 -20 153 7 593 46 740 26 101 43 180 39 183 -2 2 -47 27 -99 57 -52
      29 -178 104 -278 168 -122 75 -187 111 -194 104 -5 -5 -14 -43 -19 -83 -35
      -282 -109 -473 -213 -553 -117 -89 -261 -88 -366 2 -107 91 -168 244 -209 521
      -10 63 -21 116 -27 118 -5 2 -90 -47 -189 -108z"/>
      </g>
    </svg>
  `;










  const [textColor, setTextColor] = useState("black");

  const HandleTextColor = (e) => {
    const color = e.target.value;
    setTextColor(color);
  }


  
  
  const svgurl = svgToURL(svg);




  const SvgImage =()=>{
    const [url] = useImage(svgurl);
    return (
      <Image image={url} x={-6}  y={0}   width={610} height={610} />
    )
  }



  const [imageX, setImageX] = useState(94);
  const [imageY, setImageY] = useState(150);
  const [textX, setTextX] = useState(86);
  const [textY, setTextY] = useState(320);
  

  // Permanent

  return (
    <>
      <div className="drawer lg:drawer-open w-96 absolute z-10">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex justify-around items-center">
            <div>
              <h1 className="text-3xl font-semibold ">Edit Your Shirt</h1>
              <hr />
            </div>

            <div>
              <label className="font-semibold text-lg">
             
                Change Shirt Color:
              </label>
              <input
                type="color"
                value={"#ffffff"}
            
                onChange={HandleColorInput}
              />
            </div>

            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              Edit
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="  w-auto h-auto flex flex-col justify-center items-end  scale-50 md:scale-100 p-8 bg-slate-800 rounded-lg">
                <form method="dialog">
                  <button className="btn text-xl btn-sm btn-circle btn-ghost  right-2 top-2">
                    ✕
                  </button>
                </form>


                <Stage
                  className=" text-center "
                  id="konva"
               
                  width={600}
                  height={600}

                >
                  <Layer>
                

                 

              <SvgImage/>

                    <NewImage x={imageX} y={imageY} draggable onDragEnd={(e)=>{
setImageX(e.target.x()),setImageY(e.target.y())
}} />

                    <NewText x={textX} y={textY}  fill={textColor} onDragEnd={(e)=>{
setTextX(e.target.x()),setTextY(e.target.y())
}} />
                  </Layer>
                </Stage>
              </div>
            </dialog>

            <div>
              <h1 className="text-xl font-semibold ">Add Image</h1>
              <input
                onChange={HandleImageInput}
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              />
            </div>

            <div className="flex justify-center items-center w-full flex-col">
              <h1 className="text-xl font-semibold ">Add Text</h1>
              <form
                id="text-form"
                className="flex justify-center items-center"
                onSubmit={HandleSubmitText}
              >
                <input
                  type="text"
                  ref={textInput}
                  placeholder="Type here"
                  className="input input-bordered input-accent w-full max-w-xs"
                />
                <button className="btn btn-active btn-accent">Add</button>
              </form>


              <div>
              <label className="font-semibold text-lg">
             
                Change Text Color:
              </label>
              <input
              className="my-5"
                type="color"
                value={"#00009"}
            
                onChange={HandleTextColor}
              />
            </div>


            </div>

            <button id="export-btn" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Export</button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
