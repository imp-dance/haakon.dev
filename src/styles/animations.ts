import { keyframes } from "styled-components";

export const fadeInUp = keyframes`
    from{
        transform:translate(0px, 5px) scale(0.999);
        opacity:0;
    }
`;

export const fadeUpButtons = keyframes`
    from{
        transform:translate(0px, 10%);
        opacity:0;
    }
`;

export const fadeIn = keyframes`
    from{
        opacity:0.2;
    }
    to{
      opacity:1;
    }
`;

export const expandOut = keyframes`
    from{
        transform:scaleY(0);
    }
`;

export const DialogAnimation = keyframes`
  from {
    transform:translate(-50%, calc(-50% + 10px)) scale(.9);
    opacity:0;
  }
`;

export const DialogOutAnimation = keyframes`
  to {
    transform:translate(-50%, calc(-50% + 10px)) scale(.9);
    opacity:0;
  }
`;
