import React from 'react';

// wrapper that sets the font to Aleo-(Regular|Bold|etc.)
function aleofy(Component, fontStyle=null) {
  const fontFamily = (fontStyle == null) ? `Aleo` : `Aleo-${fontStyle}`
  return (props) => (
      <Component {...props}
        style={[{ fontFamily: fontFamily}, props.style]}>

        {props.children}
      </Component>
  );
}

export default aleofy;
