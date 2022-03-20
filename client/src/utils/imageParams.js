/** Exposes different parameters for use in responsive images on SponsorFFy (Implemented Aug 23 2021)*/
export const BaseImg = ({ src, alt, id="", className="", onClick, srcSet="", sizes="" }) =>{
  return(
    <img
    id={ id? id:null }
    className={ className?className:null }
    srcSet={srcSet}
    sizes={sizes}
    src={src} 
    alt={alt} 
    onClick={onClick ?() => onClick():null} //Implements onClick for avatars
    />    
  )
};

/* ----------->  AVATAR  <----------- */
export const defaultAvatar = "https://spfy-dev.imgix.net/default_dp_400x400.png";

export const avatarParam = (width)=>`w=${ width }&h=${ width }&crop=faces,edges&q=60&auto=format,compress,enhance&fit=clamp`;
const avatarSrc = (width) => `${avatarParam(width)} ${width}w`;
const { s, m, l } = { s:"73", m:"96", l:"400" };

export const AVATAR = ( props )=>{
  const largeAvSrcSet = `${props.src}?${avatarSrc(l)}`

  const regAvSrcSet = `
  ${props.src}?${avatarSrc(s)},
  ${props.src}?${avatarSrc(m)},
  ${props.src}?${avatarSrc(l)}
  `
  const srcSet = props.isLargeAvatar? largeAvSrcSet : regAvSrcSet;
  
  const sizes= `
  (max-width: 480px) 45px,
  (max-width:768px) 96px,
  (min-width:769px) 100px,
  `
  return(
    <BaseImg 
    {...{...props , srcSet, sizes} }
    />
  )
}


/* ----------->  FEED PHOTOS  <----------- */

// export const getParam = (W)=>`w=${ W }q=65&auto=format,compress&fit=clip`;
const getSrc=(width) =>`w=${ width }&q=65&auto=format,compress ${width}w`;

const feedW = {xty:"280",ty:"480",xsm:"640", sm:"768", md:"840", lg:"999", xl:"1198", xxl:"1500"};

export const FEEDIMG = ( props ) =>{
  const srcSet=  `
  ${props.src}?${getSrc(feedW.xty)},
  ${props.src}?${getSrc(feedW.ty)},
  ${props.src}?${getSrc(feedW.xsm)},
  ${props.src}?${getSrc(feedW.sm)},
  ${props.src}?${getSrc(feedW.md)},
  ${props.src}?${getSrc(feedW.lg)},
  ${props.src}?${getSrc(feedW.xl)},
  ${props.src}?${getSrc(feedW.xxl)}
  `
  const sizes= `
  (max-width: 414px) 100vw,
  (max-width: 599px) calc(calc(100vw - 92px) * 0.648),
  (max-width: 1200px) calc(calc(100vw - 252px) * 0.68),
  calc((100vw - 732px) * 0.54)
  `
  return(
    <BaseImg
      {...{...props , srcSet, sizes} }
    />
  )
}
//  (max-width: 1499px) calc(0.612 * (100vw - 552px)),

/** --------> PROFILE PHOTOS ---------> */ 
const profileW = {xty:"150",ty:"250",xsm:"350", sm:"450", md:"550", lg:"650", xl:"768", xxl:"1500"};
const profileSrcSet = (src) =>  `
${src}?${getSrc(profileW.xty)},
${src}?${getSrc(profileW.ty)},
${src}?${getSrc(profileW.xsm)},
${src}?${getSrc(profileW.sm)},
${src}?${getSrc(profileW.md)},
${src}?${getSrc(profileW.lg)},
${src}?${getSrc(profileW.xl)},
${src}?${getSrc(profileW.xxl)}
`

export const ProfileGridImg = (props)=>{
  const srcSet= profileSrcSet(props.src)
  const sizes= `
  (max-width: 414px) calc(calc(100vw - 6px) / 2),
  (max-width: 599px) calc(calc(100vw - 12px) / 3),
  calc(calc(100vw - 20px) / 3)
  `
  return(
    <BaseImg
      {...{...props , srcSet, sizes} }
    />
  )
};

export const LargeViewImg = (props)=>{
  const srcSet= profileSrcSet(props.src)
  const sizes= ` (max-width: 870px) 85vw, 75vw `
  return(
    <BaseImg
      {...{...props , srcSet, sizes} }
    />
  )
};